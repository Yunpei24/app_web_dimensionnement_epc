import numpy as np
import sqlite3

def create_database():
    try:
        # Créer une connexion à la base de données SQLite
        conn = sqlite3.connect('app/BD/my_DB.db')
        cursor = conn.cursor()

        # Créer la table form_data si elle n'existe pas
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS form_data (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre_abonne INTEGER,
                pourcentage_data_card REAL,
                pourcentage_smartphone REAL,
                pourcentage_abonne_actif REAL,
                pourcentage_abonne_vpn REAL,
                nombre_abonne_card REAL,
                nombre_abonne_smartphone REAL,
                nombre_abonne_actif_access_internet REAL,
                nombre_abonne_use_vpn REAL
            )
        ''')

        # Valider et sauvegarder les changements
        conn.commit()
        print("Base de données créée avec succès.")

    except Exception as e:
        print(f"Erreur lors de la création de la base de données : {e}")

    finally:
        # Fermer la connexion à la base de données
        if conn:
            conn.close()

################## ############################## #################### #################
