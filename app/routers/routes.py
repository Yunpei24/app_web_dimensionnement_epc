from fastapi import APIRouter, Response, Request, HTTPException
from fastapi.responses import FileResponse, JSONResponse
from app.utils import fonctions_operation as fo
import app.models.models as md
import sqlite3

router = APIRouter()

@router.on_event("startup")
async def startup_event():
    """
    Event that is triggered on application startup.
    """
    fo.create_database()

@router.post('/send_form')
async def configuration(data: md.ConfigEntreeModel):
    try:
        conn = sqlite3.connect('app/BD/my_DB.db')
        cursor = conn.cursor()
        nombreAbonneeCard = data.nombreAbonnee * data.pourcentageCard
        nombreAbonneeSmartphone = data.nombreAbonnee * data.pourcentageSmartphone
        nombreAbonneeActifAccessInternet = data.nombreAbonnee * data.pourcentageAboActifAccessInternet
        nombreAbonneeUseVpn = nombreAbonneeCard * data.pourcentageAboUseVpn

        # Enregistrement des données dans la base de données SQLite
        query = """
        INSERT INTO form_data (nombre_abonne, pourcentage_data_card, pourcentage_smartphone, pourcentage_abonne_actif, pourcentage_abonne_vpn,
                               nombre_abonne_card, nombre_abonne_smartphone, nombre_abonne_actif_access_internet, nombre_abonne_use_vpn)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """
        cursor.execute(query, (
            data.nombreAbonnee,
            data.pourcentageCard,
            data.pourcentageSmartphone,
            data.pourcentageAboActifAccessInternet,
            data.pourcentageAboUseVpn,
            nombreAbonneeCard,
            nombreAbonneeSmartphone,
            nombreAbonneeActifAccessInternet,
            nombreAbonneeUseVpn
        ))

        # Valider et sauvegarder les changements
        conn.commit()

        return {"message": "Données enregistrées avec succès dans la base de données"}
    except Exception as e:
        return {"error": str(e)}
    finally:
        # Fermer la connexion à la base de données
        conn.close()

@router.get("/get_data")
async def get_data_from_database():
    try:
        conn = sqlite3.connect('app/BD/my_DB.db')
        # Utilisez la connexion pour exécuter votre requête SQL
        cursor = conn.cursor()
        query = """
        SELECT nombre_abonne, pourcentage_data_card, pourcentage_smartphone, pourcentage_abonne_actif, pourcentage_abonne_vpn, nombre_abonne_card, nombre_abonne_smartphone, nombre_abonne_actif_access_internet, nombre_abonne_use_vpn
        FROM form_data
        ORDER BY id DESC
        LIMIT 1
        """
        cursor.execute(query)

        # Obtenez les noms des colonnes
        columns = [column[0] for column in cursor.description]

        # Récupérez les résultats
        data = dict(zip(columns, cursor.fetchone()))

        # Retournez les données en format JSON
        return JSONResponse(content={"data": data})

    except Exception as e:
        # Gérez les erreurs comme vous le souhaitez
        return JSONResponse(content={"error": f"Erreur lors de la récupération des données : {str(e)}"})
    finally:
        # Fermez le curseur et la connexion à la fin
        cursor.close()
        conn.close()