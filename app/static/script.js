function clearData() {
    localStorage.removeItem('totalDL1');
    localStorage.removeItem('totalUlDL1');
    localStorage.removeItem('VPNVolumeULDL1');
    localStorage.removeItem('VPNVolumeDL1');
    
    localStorage.removeItem('totalDL2');
    localStorage.removeItem('totalUlDL2');
    localStorage.removeItem('VPNVolumeULDL2');
    localStorage.removeItem('VPNVolumeDL2');
    localStorage.removeItem('nombresProcessArray');
    localStorage.removeItem('debit_int_dl');
    localStorage.removeItem('debit_vpn_dl');
    localStorage.removeItem('capaciteArray');
    localStorage.removeItem('nombreTotal');
}

window.addEventListener('beforeunload', function(event) {
    // Vérifier si la redirection se fait vers une autre page du même site
    const targetUrl = new URL(event.target.location.href);
    const currentUrl = new URL(window.location.href);
    
    if (targetUrl.origin !== currentUrl.origin) {
        // La redirection se fait vers un autre domaine, nettoyer les données
        clearData();
    }
});
function redirectToPage(IdBtn) {
    if (IdBtn === 'btn_tg'){
        // Pour rediriger l'utilisateur vers la page trafic_total
        window.location.href = "/trafic_total";
    }else if(IdBtn === 'retour_tt'){
        // Pour rediriger l'utilisateur vers la page trafic_genere
        window.location.href = "/trafic_genere";
    }else if(IdBtn === 'btn_ipc'){
         // Pour rediriger l'utilisateur vers la page interfaces_plan_control
         window.location.href = "/interfaces_plan_control";
    }else if(IdBtn === 'btn_dpc'){
        // Pour rediriger l'utilisateur vers la page plan_control
        window.location.href = "/plan_control";
   }
}

function validateForm() {
    var nombreAbonne = parseFloat(document.getElementById('nombreAbonne').value);
    var pourcentageDataCard = parseFloat(document.getElementById('pourcentageDataCard').value);
    var pourcentageSmartphone = parseFloat(document.getElementById('pourcentageSmartphone').value);
    var pourcentageAbonneActif = parseFloat(document.getElementById('pourcentageAbonneActif').value);
    var pourcentageAbonneVPN = parseFloat(document.getElementById('pourcentageAbonneVPN').value);

    if (isNaN(nombreAbonne) || nombreAbonne < 0 || !Number.isInteger(nombreAbonne)) {
        displayError('Nombre d\'abonné doit être un entier positif.');
        return false;
    }

    if (isNaN(pourcentageDataCard) || pourcentageDataCard <= 0 || pourcentageDataCard > 1) {
        displayError('Pourcentage de DataCard doit être entre 0 et 1.');
        return false;
    }

    if (isNaN(pourcentageSmartphone) || pourcentageSmartphone <= 0 || pourcentageSmartphone > 1) {
        displayError('Pourcentage de Smartphone doit être entre 0 et 1.');
        return false;
    }

    if (isNaN(pourcentageAbonneActif) || pourcentageAbonneActif <= 0 || pourcentageAbonneActif > 1) {
        displayError("Pourcentage d\'abonné actif avec accès internet doit être entre 0 et 1.");
        return false;
    }

    if (isNaN(pourcentageAbonneVPN) || pourcentageAbonneVPN <= 0 || pourcentageAbonneVPN > 1) {
        displayError("Pourcentage d\'abonné utilisant VPN doit être entre 0 et 1.");
        return false;
    }

    // localStorage.setItem('nombreAbonne', nombreAbonne);

    return true;
}

function displayError(message) {
    document.getElementById('error-message').innerText = message;
}

/////////////////////////////  Page Configuration des Valeurs Entrées  ////////////////////////////

// Fonction pour l'envoi des données
function submitForm(event) {
    event.preventDefault(); // Empêcher la soumission par défaut du formulaire

    if (validateForm()) {
        // Récupérer les données du formulaire
        var formData = {
            nombreAbonnee: parseInt(document.getElementById('nombreAbonne').value, 10),
            pourcentageCard: parseFloat(document.getElementById('pourcentageDataCard').value),
            pourcentageSmartphone: parseFloat(document.getElementById('pourcentageSmartphone').value),
            pourcentageAboActifAccessInternet: parseFloat(document.getElementById('pourcentageAbonneActif').value),
            pourcentageAboUseVpn: parseFloat(document.getElementById('pourcentageAbonneVPN').value)
        };

        
        // Effectuer la requête POST à l'endpoint FastAPI
        fetch('/send_form', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(response => {
            // Traiter la réponse du serveur
  
            // Afficher un message pop-up en fonction de la réponse
            if (response.error) {
              alert('Envoi Echoué');
            } else {
              alert('Envoi Réussi');
            }
          })
        .catch(error => {
            console.error('Erreur:', error);
        });
    }
}

// Script pour la page Trafic

function resetForm(formId) {
    var form = document.getElementById(formId);
    var rows = form.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
    // Réinitialisez les valeurs du formulaire
    document.getElementById(formId).reset();
    
    for (var i = 0; i < rows.length; i++) {
        rows[i].getElementsByTagName('span')[0].textContent = '';
        rows[i].getElementsByTagName('span')[1].textContent = '';

    }
    
}

/////////////////////////////////// Page des Calculs des Trafic //////////////////////////////////////////
// Fonction pour calculer le trafic
function calculateTraffic(formId) {
    var form = document.getElementById(formId);
    var rows = form.getElementsByTagName('tbody')[0].getElementsByTagName('tr');


    if (formId === 'form1'){
        var totalDL1 = 0;
        var totalUlDL1 = 0;
        var VPNVolumeULDL1 = 0;
        var VPNVolumeDL1 = 0;
        for (var i = 0; i < 5; i++) {
            var nombreSessions = parseFloat(rows[i].getElementsByTagName('input')[0].value) || 0;
            var tailleSession = parseFloat(rows[i].getElementsByTagName('input')[1].value) || 0;
            var pourcentageDL = parseFloat(rows[i].getElementsByTagName('input')[2].value) || 0;

            // Calculs
            var volumeULDL = nombreSessions * tailleSession;
            var volumeDL = volumeULDL * pourcentageDL;
            if (i != 3){
                totalDL1 += volumeDL;
                totalUlDL1 += volumeULDL;
            }else{
                VPNVolumeULDL1 = volumeULDL;
                VPNVolumeDL1 = volumeDL;
            }

            // Mise à jour des résultats dans les cellules appropriées
            rows[i].getElementsByTagName('span')[0].textContent = volumeULDL.toFixed(3);
            rows[i].getElementsByTagName('span')[1].textContent = volumeDL.toFixed(3);
        }
        rows[5].getElementsByTagName('span')[0].textContent = totalUlDL1.toFixed(3);
        rows[5].getElementsByTagName('span')[1].textContent = totalDL1.toFixed(3);

        // Sauvegarde des valeurs dans le localStorage
        localStorage.setItem('totalDL1', totalDL1);
        localStorage.setItem('totalUlDL1', totalUlDL1);
        localStorage.setItem('VPNVolumeULDL1', VPNVolumeULDL1);
        localStorage.setItem('VPNVolumeDL1', VPNVolumeDL1);
    } else if (formId === 'form2'){
        var totalDL2 = 0;
        var totalUlDL2 = 0;
        var VPNVolumeULDL2 = 0;
        var VPNVolumeDL2 = 0;
        for (var i = 0; i < 5; i++) {
            var nombreSessions = parseFloat(rows[i].getElementsByTagName('input')[0].value) || 0;
            var tailleSession = parseFloat(rows[i].getElementsByTagName('input')[1].value) || 0;
            var pourcentageDL = parseFloat(rows[i].getElementsByTagName('input')[2].value) || 0;

            // Calculs
            var volumeULDL = nombreSessions * tailleSession;
            var volumeDL = volumeULDL * pourcentageDL;
            if (i != 3){
                totalDL2 += volumeDL;
                totalUlDL2 += volumeULDL;
            }else{
                rows[6].getElementsByTagName('span')[0].textContent = volumeULDL.toFixed(3);
                rows[6].getElementsByTagName('span')[1].textContent = volumeDL.toFixed(3);
                VPNVolumeULDL2 = volumeULDL;
                VPNVolumeDL2 = volumeDL;
            }

            // Mise à jour des résultats dans les cellules appropriées
            rows[i].getElementsByTagName('span')[0].textContent = volumeULDL.toFixed(3);
            rows[i].getElementsByTagName('span')[1].textContent = volumeDL.toFixed(3);
        }
        rows[5].getElementsByTagName('span')[0].textContent = totalUlDL2.toFixed(3);
        rows[5].getElementsByTagName('span')[1].textContent = totalDL2.toFixed(3);

        // Sauvegarde des valeurs dans le localStorage
        localStorage.setItem('totalDL2', totalDL2);
        localStorage.setItem('totalUlDL2', totalUlDL2);
        localStorage.setItem('VPNVolumeULDL2', VPNVolumeULDL2);
        localStorage.setItem('VPNVolumeDL2', VPNVolumeDL2);
    }

}

function processDatabaseData(databaseData) {

    var totalDL1 = localStorage.getItem('totalDL1');
    var totalUlDL1 = localStorage.getItem('totalUlDL1');

    var totalDL2 = localStorage.getItem('totalDL2');
    var totalUlDL2 = localStorage.getItem('totalUlDL2');
    var VPNVolumeULDL2 = localStorage.getItem('VPNVolumeULDL2');
    var VPNVolumeDL2 = localStorage.getItem('VPNVolumeDL2');

    document.getElementById('VTTHSDU_volumeULDL').textContent = (databaseData.nombre_abonne_smartphone * totalUlDL1 / 1000000).toFixed(5) || 'N/A';
    document.getElementById('VTTHSDU_volumeDL').textContent = (databaseData.nombre_abonne_smartphone * totalDL1 / 1000000).toFixed(5) || 'N/A';

    document.getElementById('VTTCD_volumeULDL').textContent = (databaseData.nombre_abonne_card * totalUlDL2 / 1000000).toFixed(5) || 'N/A';
    document.getElementById('VTTCD_volumeDL').textContent = (databaseData.nombre_abonne_card * totalDL2 / 1000000).toFixed(5) || 'N/A';

    document.getElementById('VTT_volumeULDL').textContent = ((databaseData.nombre_abonne_smartphone * totalUlDL1 / 1000000) + (databaseData.nombre_abonne_card * totalUlDL2) / 1000000).toFixed(5) || 'N/A';
    document.getElementById('VTT_volumeDL').textContent = ((databaseData.nombre_abonne_smartphone * totalDL1 / 1000000) + (databaseData.nombre_abonne_card * totalDL2 / 1000000)).toFixed(5) || 'N/A';

    var traficTotalInternetULDL = parseFloat(document.getElementById('VTT_volumeULDL').textContent);
    var traficTotalInternetDL = parseFloat(document.getElementById('VTT_volumeDL').textContent);

    document.getElementById('DIHC_volumeULDL').textContent = ((traficTotalInternetULDL * 8 * 1000 ) / 3600).toFixed(8) || 'N/A';
    document.getElementById('DIHC_volumeDL').textContent = ((traficTotalInternetDL * 8 * 1000) / 3600).toFixed(5) || 'N/A';

    document.getElementById('DCVPN_nombre1').textContent = (databaseData.nombre_abonne_use_vpn) || 'N/A';
    document.getElementById('DCVPN_nombre2').textContent = (databaseData.nombre_abonne_use_vpn) || 'N/A';

    document.getElementById('TTVPN_volumeULDL').textContent = (VPNVolumeULDL2 * databaseData.nombre_abonne_use_vpn / 1000000).toFixed(3) || 'N/A';
    document.getElementById('TTVPN_volumeDL').textContent = (VPNVolumeDL2 * databaseData.nombre_abonne_use_vpn / 1000000).toFixed(3) || 'N/A';

    document.getElementById('DTVPN_volumeULDL').textContent = ((VPNVolumeULDL2 * databaseData.nombre_abonne_use_vpn) * 8 / 3600000).toFixed(3) || 'N/A';
    document.getElementById('DTVPN_volumeDL').textContent = ((VPNVolumeDL2 * databaseData.nombre_abonne_use_vpn) * 8 / 3600000).toFixed(3) || 'N/A';

    localStorage.setItem('debit_int_dl', ((traficTotalInternetDL * 8 * 1000) / 3600).toFixed(5));
    localStorage.setItem('debit_vpn_dl', ((VPNVolumeDL2 * databaseData.nombre_abonne_use_vpn) * 8 / 3600000).toFixed(3));

}

async function fetchDataFromAPI() {
    try {
        const response = await fetch('/get_data');
        const data = await response.json();
        
        // Vérifier si 'data' est un objet et a une seule clé
        if (typeof data === 'object' && Object.keys(data).length === 1) {
            // Extraire la valeur associée à la clé
            const valeur = data[Object.keys(data)[0]];
            return valeur;
        } else {
            console.error('La structure de données renvoyée depuis la base de données n\'est pas conforme à celle attendue.');
            return null; // ou retourner une valeur par défaut
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des données de la base de données', error);
        return null; // ou retourner une valeur par défaut
    }
}

async function calculateTrafficTotal(formId){
    const data = await fetchDataFromAPI();
    // Appeler une fonction pour traiter les données et mettre à jour le tableau
    processDatabaseData(data);
}


///////////////////////////////// Trafic de signalisation //////////////////////////////////

function resetSigForm(formId) {
    // Réinitialiser le formulaire en remettant toutes les valeurs à zéro
    var form = document.getElementById(formId);
    form.reset();

    // Mettre à jour toutes les cellules 'Nombre' à zéro
    var cellsNombre = form.querySelectorAll('table tbody td:nth-child(3) span');
    for (var i = 0; i < cellsNombre.length; i++) {
        cellsNombre[i].textContent = '0.00';
    }

    // Mettre à jour la dernière cellule de la colonne 'Nombre' à zéro
    var cellNombreProcedures = form.querySelector('#nombre_procedure');
    cellNombreProcedures.textContent = '0.00';
}

async function calculateTrafficSig(formId) {

    const data = await fetchDataFromAPI();
    var nbre_abonnee_actif_HC = data.nombre_abonne;

    // Récupérer les éléments du formulaire
    var form = document.getElementById(formId);
    var pourcentageUserActif = parseFloat(form.querySelector('input[name="PUAHC_pourcentage"]').value) || 0;

    // Calculer nombreUserActif
    var nombreUserActif = pourcentageUserActif * nbre_abonnee_actif_HC;

    // Récupérer les lignes du tableau (sauf la dernière)
    var rows = form.querySelectorAll('table tbody tr:not(:last-child)');

    // Tableau pour stocker les nombres calculés
    var nombresProcessArray = [];

    // Initialiser la somme des procédures
    var sumProcedures = 0;

    // Parcourir les lignes du tableau
    for (var i = 0; i < rows.length; i++) {
        // Récupérer la cellule de la colonne 'Procédure/Abonné/HC' et 'Nombre'
        var cellProcedure = rows[i].querySelector('td:nth-child(2) input');
        var cellNombre = rows[i].querySelector('td:nth-child(3) span');

        // Calculer le nombre en fonction de la procédure
        var nombre = parseFloat(cellProcedure.value) * nombreUserActif;

        // Mettre à jour la cellule 'Nombre'
        cellNombre.textContent = nombre;

        // Ajouter le nombre au tableau
        nombresProcessArray.push(nombre);

        // Ajouter le nombre à la somme des procédures
        sumProcedures += nombre;
    }

    // Mettre à jour la dernière cellule de la colonne 'Nombre'
    var cellNombreProcedures = form.querySelector('#nombre_procedure');
    cellNombreProcedures.textContent = sumProcedures;

    // Sauvegarder le tableau dans localStorage
    localStorage.setItem('nombresProcessArray', JSON.stringify(nombresProcessArray));
    localStorage.setItem('nombreTotal', sumProcedures); 
}


/////////////////////////////   Calcul des Capacités des Interfaces S1U et S8 (Trafic Utilisateur) ///////////////////////////////

async function calculateTrafficIPC(formId) {
    // Récupérer la valeur saisie au niveau de 'Taille moyen d'un message (bits)'
    var form0 = document.getElementById('form0');
    var tailleMoyenneMessage = parseFloat(form0.querySelector('input[name="TMM_msg"]').value) || 0;
    // Récupérer la chaîne JSON depuis localStorage
    const nombresArrayJSON = localStorage.getItem('nombresProcessArray');
    // Convertir la chaîne JSON en tableau
    const nombresProcessArray = JSON.parse(nombresArrayJSON);

    if (formId === 'formS1C') {
        // Vérifier si nombresProcessArray est défini
        if (typeof nombresProcessArray !== 'undefined' && nombresProcessArray.length > 0) {
            // Récupérer les éléments du formulaire
            var form = document.getElementById(formId);

            // Parcourir les lignes du tableau
            for (var i = 0; i < nombresProcessArray.length; i++) {
                // Récupérer la cellule de la colonne 'Nombre'
                var cellNombre = form.querySelector(`#n_${nombresProcessArray[i].procedure.toLowerCase()}_nombre_s1c`);

                // Récupérer la cellule de la colonne 'Nombre de messages/procèdure via S1-C'
                var cellNombreMessages = form.querySelector(`input[name="${nombresProcessArray[i].procedure.toLowerCase()}_msg_s1c"]`);

                // Récupérer la cellule de la colonne 'Capacité S1-C (Gbits/s)'
                var cellCapacite = form.querySelector(`#n_${nombresProcessArray[i].procedure.toLowerCase()}_capcite_s1c`);

                // Calculer le nombre en fonction de la procédure et mettre à jour la cellule 'Nombre'
                var nombre = nombresProcessArray[i].nombre;
                cellNombre.textContent = nombre;

                // Récupérer la valeur du tableau multipliée par la valeur saisie au niveau de 'Taille moyen d'un message (bits)'
                // et par la case correspondante de la colonne 'Nombre de messages/procèdure via S1-C'
                var capacite = nombre * tailleMoyenneMessage * parseFloat(cellNombreMessages.value);
                cellCapacite.textContent = capacite.toFixed(5); // Formater le résultat avec 2 décimales
            }

            // Mettre à jour la dernière cellule de la colonne 'Capacité Totale (Gbits/s)'
            var cellCapaciteTotale = form.querySelector('#n_capcite_totale_s1c');
            var sumCapacites = nombresProcessArray.reduce((sum, item) => sum + item.nombre * tailleMoyenneMessage * parseFloat(form.querySelector(`input[name="${item.procedure.toLowerCase()}_msg_s1c"]`).value), 0);
            cellCapaciteTotale.textContent = sumCapacites.toFixed(5); // Formater le résultat avec 2 décimales
        }
        else {
            console.error('nombresProcessArray is not defined or empty.');
        }
    } else if (formId === 'formS11') {
        // Vérifier si nombresProcessArray est défini
        if (typeof nombresProcessArray !== 'undefined' && nombresProcessArray.length > 0) {
            // Récupérer les éléments du formulaire
            var form = document.getElementById(formId);

            // Parcourir les lignes du tableau
            for (var i = 0; i < nombresProcessArray.length; i++) {
                // Récupérer la cellule de la colonne 'Nombre'
                var cellNombre = form.querySelector(`#n_${nombresProcessArray[i].procedure.toLowerCase()}_nombre_s11`);

                // Récupérer la cellule de la colonne 'Nombre de messages/procèdure via S11'
                var cellNombreMessages = form.querySelector(`input[name="${nombresProcessArray[i].procedure.toLowerCase()}_msg_s11"]`);

                // Récupérer la cellule de la colonne 'Capacité S11 (Gbits/s)'
                var cellCapacite = form.querySelector(`#n_${nombresProcessArray[i].procedure.toLowerCase()}_capcite_s11`);

                // Calculer le nombre en fonction de la procédure et mettre à jour la cellule 'Nombre'
                var nombre = nombresProcessArray[i].nombre;
                cellNombre.textContent = nombre;

                // Récupérer la valeur du tableau multipliée par la valeur saisie au niveau de 'Taille moyen d'un message (bits)'
                // et par la case correspondante de la colonne 'Nombre de messages/procèdure via S11'
                var capacite = nombre * tailleMoyenneMessage * parseFloat(cellNombreMessages.value);
                cellCapacite.textContent = capacite.toFixed(5); // Formater le résultat avec 5 décimales
            }

            // Mettre à jour la dernière cellule de la colonne 'Capacité Totale (Gbits/s)'
            var cellCapaciteTotale = form.querySelector('#n_capcite_totale_s11');
            var sumCapacites = nombresProcessArray.reduce((sum, item) => sum + item.nombre * tailleMoyenneMessage * parseFloat(form.querySelector(`input[name="${item.procedure.toLowerCase()}_msg_s11"]`).value), 0);
            cellCapaciteTotale.textContent = sumCapacites.toFixed(5); // Formater le résultat avec 5 décimales
        }
        else {
            console.error('nombresProcessArray is not defined or empty.');
        }
    }else if(formId === 'formS8'){
        // Vérifier si nombresProcessArray est défini
        if (typeof nombresProcessArray !== 'undefined' && nombresProcessArray.length > 0) {
            // Récupérer les éléments du formulaire
            var form = document.getElementById(formId);

            // Parcourir les lignes du tableau
            for (var i = 0; i < nombresProcessArray.length; i++) {
                // Récupérer la cellule de la colonne 'Nombre'
                var cellNombre = form.querySelector(`#n_${nombresProcessArray[i].procedure.toLowerCase()}_nombre_s8`);

                // Récupérer la cellule de la colonne 'Nombre de messages/procèdure via S8'
                var cellNombreMessages = form.querySelector(`input[name="${nombresProcessArray[i].procedure.toLowerCase()}_msg_s8"]`);

                // Récupérer la cellule de la colonne 'Capacité S8 (Gbits/s)'
                var cellCapacite = form.querySelector(`#n_${nombresProcessArray[i].procedure.toLowerCase()}_capcite_s8`);

                // Calculer le nombre en fonction de la procédure et mettre à jour la cellule 'Nombre'
                var nombre = nombresProcessArray[i].nombre;
                cellNombre.textContent = nombre;

                // Récupérer la valeur du tableau multipliée par la valeur saisie au niveau de 'Taille moyen d'un message (bits)'
                // et par la case correspondante de la colonne 'Nombre de messages/procèdure via S8'
                var capacite = nombre * tailleMoyenneMessage * parseFloat(cellNombreMessages.value);
                cellCapacite.textContent = capacite.toFixed(5); // Formater le résultat avec 5 décimales
            }

            // Mettre à jour la dernière cellule de la colonne 'Capacité Totale (Gbits/s)'
            var cellCapaciteTotale = form.querySelector('#n_capcite_totale_s8');
            var sumCapacites = nombresProcessArray.reduce((sum, item) => sum + item.nombre * tailleMoyenneMessage * parseFloat(form.querySelector(`input[name="${item.procedure.toLowerCase()}_msg_s8"]`).value), 0);
            cellCapaciteTotale.textContent = sumCapacites.toFixed(5); // Formater le résultat avec 5 décimales
        }
        else {
            console.error('nombresProcessArray is not defined or empty.');
        }
    } else if (formId === 'formS6a') {
        // Vérifier si nombresProcessArray est défini
        if (typeof nombresProcessArray !== 'undefined' && nombresProcessArray.length > 0) {
            // Récupérer les éléments du formulaire
            var form = document.getElementById(formId);

            // Parcourir les lignes du tableau
            for (var i = 0; i < nombresProcessArray.length; i++) {
                // Récupérer la cellule de la colonne 'Nombre'
                var cellNombre = form.querySelector(`#n_${nombresProcessArray[i].procedure.toLowerCase()}_nombre_s6a`);

                // Récupérer la cellule de la colonne 'Nombre de messages/procèdure via S6a'
                var cellNombreMessages = form.querySelector(`input[name="${nombresProcessArray[i].procedure.toLowerCase()}_msg_s6a"]`);

                // Récupérer la cellule de la colonne 'Capacité S6a (Gbits/s)'
                var cellCapacite = form.querySelector(`#n_${nombresProcessArray[i].procedure.toLowerCase()}_capcite_s6a`);

                // Calculer le nombre en fonction de la procédure et mettre à jour la cellule 'Nombre'
                var nombre = nombresProcessArray[i].nombre;
                cellNombre.textContent = nombre;

                // Récupérer la valeur du tableau multipliée par la valeur saisie au niveau de 'Taille moyen d'un message (bits)'
                // et par la case correspondante de la colonne 'Nombre de messages/procèdure via S6a'
                var capacite = nombre * tailleMoyenneMessage * parseFloat(cellNombreMessages.value);
                cellCapacite.textContent = capacite.toFixed(5); // Formater le résultat avec 5 décimales
            }

            // Mettre à jour la dernière cellule de la colonne 'Capacité Totale (Gbits/s)'
            var cellCapaciteTotale = form.querySelector('#n_capcite_totale_s6a');
            var sumCapacites = nombresProcessArray.reduce((sum, item) => sum + item.nombre * tailleMoyenneMessage * parseFloat(form.querySelector(`input[name="${item.procedure.toLowerCase()}_msg_s6a"]`).value), 0);
            cellCapaciteTotale.textContent = sumCapacites.toFixed(5); // Formater le résultat avec 5 décimales
        }
        else {
            console.error('nombresProcessArray is not defined or empty.');
        }
    }
}

function resetFormIPC(formId) {
    // Récupérer l'élément du formulaire
    var form = document.getElementById(formId);
    var formP = document.getElementById("form0");

    // Réinitialiser la valeur de 'Taille moyen d'un message (bits)'
    formP.querySelector('input[name="TMM_msg"]').value = "";

    if(formId === 'formS1C'){
        // Réinitialiser les valeurs des colonnes 'Nombre' et 'Capacité S1-C (Gbits/s)'
        var rows = form.querySelectorAll('table tbody tr:not(:last-child)');
        for (var i = 0; i < rows.length; i++) {
            // Réinitialiser la colonne 'Nombre'
            var cellNombreMsg = rows[i].querySelector('td:nth-child(3) input');
            cellNombreMsg.value = "";

            // Réinitialiser la colonne 'Capacité S1-C (Gbits/s)'
            var cellCapaciteS1C = rows[i].querySelector('td:nth-child(4) span');
            cellCapaciteS1C.textContent = "";
        }

        // Réinitialiser la dernière cellule de la colonne 'Capacité S1-C (Gbits/s)'
        var cellCapaciteTotaleS1C = form.querySelector('#n_capcite_totale_s1c');
        cellCapaciteTotaleS1C.textContent = "";
    }else if(formId === 'formS11'){
         // Réinitialiser les valeurs des colonnes 'Nombre' et 'Capacité S11 (Gbits/s)'
         var rows = form.querySelectorAll('table tbody tr:not(:last-child)');
         for (var i = 0; i < rows.length; i++) {
             // Réinitialiser la colonne 'Nombre'
             var cellNombreMsg = rows[i].querySelector('td:nth-child(3) input');
             cellNombreMsg.value = "";
 
             // Réinitialiser la colonne 'Capacité S11 (Gbits/s)'
             var cellCapaciteS11 = rows[i].querySelector('td:nth-child(4) span');
             cellCapaciteS11.textContent = "";
         }
 
         // Réinitialiser la dernière cellule de la colonne 'Capacité S11 (Gbits/s)'
         var cellCapaciteTotaleS11 = form.querySelector('#n_capcite_totale_s11');
         cellCapaciteTotaleS11.textContent = "";
    }else if(formId === 'formS8'){
         // Réinitialiser les valeurs des colonnes 'Nombre' et 'Capacité S8 (Gbits/s)'
         var rows = form.querySelectorAll('table tbody tr:not(:last-child)');
         for (var i = 0; i < rows.length; i++) {
             // Réinitialiser la colonne 'Nombre'
             var cellNombreMsg = rows[i].querySelector('td:nth-child(3) input');
             cellNombreMsg.value = "";
 
             // Réinitialiser la colonne 'Capacité S8 (Gbits/s)'
             var cellCapaciteS8 = rows[i].querySelector('td:nth-child(4) span');
             cellCapaciteS8.textContent = "";
         }
 
         // Réinitialiser la dernière cellule de la colonne 'Capacité S8 (Gbits/s)'
         var cellCapaciteTotaleS8 = form.querySelector('#n_capcite_totale_s8');
         cellCapaciteTotaleS8.textContent = "";
    }else if(formId === 'formS6a'){
         // Réinitialiser les valeurs des colonnes 'Nombre' et 'Capacité S6a (Gbits/s)'
         var rows = form.querySelectorAll('table tbody tr:not(:last-child)');
         for (var i = 0; i < rows.length; i++) {
             // Réinitialiser la colonne 'Nombre'
             var cellNombreMsg = rows[i].querySelector('td:nth-child(3) input');
             cellNombreMsg.value = "";
 
             // Réinitialiser la colonne 'Capacité S6a (Gbits/s)'
             var cellCapaciteS6a = rows[i].querySelector('td:nth-child(4) span');
             cellCapaciteS6a.textContent = "";
         }
 
         // Réinitialiser la dernière cellule de la colonne 'Capacité S6a (Gbits/s)'
         var cellCapaciteTotaleS6a = form.querySelector('#n_capcite_totale_s6a');
         cellCapaciteTotaleS6a.textContent = "";
    }
}


///////////////////////////////  Page Dimensionnement Plan Usager ////////////////////////////////

function resetFormUsager(formId) {
    var form = document.getElementById(formId);
    form.reset();
    // Reset the calculated values to empty
    document.getElementById('overhead_output').textContent = '';
    document.getElementById('debit_service_internet').textContent = '';
    document.getElementById('debit_service_vpn').textContent = '';
    document.getElementById('debit_total').textContent = '';
}

function calculatePlanUsager(formId) {
    var form = document.getElementById(formId);
    var debit_int_dl = localStorage.getItem('debit_int_dl');
    var debit_vpn_dl = localStorage.getItem('debit_vpn_dl');

    // Récupérer les valeurs des champs
    var overhead = parseFloat(form.querySelector('input[name="overhead_paquet"]').value) || 0;
    var taillePaquet = parseFloat(form.querySelector('input[name="taille_paquet"]').value) || 0;

    // Calculer le résultat
    var resultat = overhead * taillePaquet;

    // Afficher le résultat dans la cellule correspondante
    document.getElementById('overhead_output').textContent = resultat;

    // Calculer et afficher le débit pour les services Internet
    var debitInternet = (resultat + 1) * debit_int_dl;
    document.getElementById('debit_service_internet').textContent = debitInternet;

    // Calculer et afficher le débit pour le service VPN
    var debitVPN = (resultat + 1) * debit_vpn_dl;
    document.getElementById('debit_service_vpn').textContent = debitVPN;

    // Calculer et afficher le débit total
    var debitTotal = debitInternet + debitVPN;
    document.getElementById('debit_total').textContent = debitTotal;
}

//////////////////////////////  Page Dimensionnement Noeuds LTE  //////////////////////////////////

// Fonction pour réinitialiser le formulaire
function resetFormC(formId) {
    var form = document.getElementById(formId);
    // Parcourir les champs de formulaire et réinitialiser les valeurs
    var inputFields = form.querySelectorAll('input[type="number"]');
    inputFields.forEach(function (input) {
        input.value = "";
    });
    // Réinitialiser les champs de résultats
    var resultFields = form.querySelectorAll('span[id$="_capacite_"]');
    resultFields.forEach(function (span) {
        span.textContent = "";
    });
}

// Fonction pour calculer la capacité du nœud
function calculateCapaciteNoeud(formId) {
    // Sélectionne le formulaire par son ID
    var capaciteArray = [];
    var form = document.getElementById(formId);
    
    // Sélectionne toutes les lignes du tableau sauf la première (en-tête)
    var rows = form.getElementsByTagName('tr');
    
    // Parcours toutes les lignes à partir de la deuxième (index 1)
    for (var i = 1; i < rows.length; i++) {
        // Récupère les cellules de la ligne actuelle
        var cells = rows[i].getElementsByTagName('td');
        var n_cells = cells.length;
        
        // Récupère les éléments input de la ligne actuelle
        var valeurInput = cells[n_cells - 3].getElementsByTagName('input')[0];
        var pourcentageInput = cells[n_cells - 2].getElementsByTagName('input')[0];
        var capaciteSpan = cells[n_cells - 1].getElementsByTagName('span')[0];

        // Récupère les valeurs des input
        var valeur = parseFloat(valeurInput.value);
        var pourcentage = parseFloat(pourcentageInput.value);

        // Calcule la capacité en multipliant les valeurs
        var capacite = valeur * pourcentage;

        capaciteArray.push(capacite);
        // Affiche la capacité dans la colonne "Capacité d'exploitation"
        capaciteSpan.textContent = capacite.toFixed(2);
    }
    localStorage.setItem('capaciteArray', JSON.stringify(capaciteArray));
}

///////////////// Nombre de noeuds réquis /////////////////////////////

function resetFormNoeudRequis(formId) {
    var form = document.getElementById(formId);
    var spans = form.querySelectorAll('span[id^="n_"]'); // Select all spans with IDs starting with "n_"

    spans.forEach(function (span) {
        span.textContent = ''; // Reset the content of each span
    });

    // Optionally, reset the input values if there are any input elements in the form
    var inputs = form.querySelectorAll('input');
    inputs.forEach(function (input) {
        input.value = '';
    });
}

async function calculateNoeudRequis(){
    const data = await fetchDataFromAPI();
    const debit_int_dl = localStorage.getItem('debit_int_dl');
    const debit_vpn_dl = localStorage.getItem('debit_vpn_dl');
    const nombreProTotal = localStorage.getItem('nombreTotal');
    // Récupérer la chaîne JSON depuis localStorage
    const nombresArrayJSON = localStorage.getItem('nombresProcessArray');
    // Convertir la chaîne JSON en tableau
    const nombresProcessArray = JSON.parse(nombresArrayJSON);

    const capacitesArrayJSON = localStorage.getItem('capaciteArray');
    const capaciteArray = JSON.parse(capacitesArrayJSON);

    document.getElementById("n_mme_sau").textContent = Math.ceil(nombresProcessArray[0] / capaciteArray[0]);
    document.getElementById("n_mme_idle_active").textContent = Math.ceil((nombresProcessArray[2] / 3600) / capaciteArray[1]);
    document.getElementById("n_mme_trans_sec").textContent = Math.ceil((nombreProTotal / 3600) / capaciteArray[2]);
    document.getElementById("n_sgw_bearers").textContent = Math.ceil(nombresProcessArray[4] / capaciteArray[3]);
    document.getElementById("n_sgw_bh_dl_int").textContent = Math.ceil(debit_int_dl / capaciteArray[4]);
    document.getElementById("n_sgw_bh_dl_vpn").textContent = Math.ceil(debit_vpn_dl / capaciteArray[4]);
    document.getElementById("n_pgw_bearers").textContent = Math.ceil(nombresProcessArray[4] / capaciteArray[5]);
    document.getElementById("n_pgw_bh_dl_int").textContent = Math.ceil(debit_int_dl / capaciteArray[6]);
    document.getElementById("n_pgw_bh_dl_vpn").textContent = Math.ceil(debit_vpn_dl / capaciteArray[6]);
    document.getElementById("n_sgw_pgw_bearers").textContent = Math.ceil(nombresProcessArray[4] / capaciteArray[7]);
    document.getElementById("n_sgw_pgw_bh_dl_int").textContent = Math.ceil(debit_int_dl / capaciteArray[8]);
    document.getElementById("n_sgw_pgw_bh_dl_vpn").textContent = Math.ceil(debit_vpn_dl / capaciteArray[8]);
    document.getElementById("n_hss").textContent = Math.ceil(data.nombre_abonne / capaciteArray[9]);
    document.getElementById("n_pcrf").textContent = Math.ceil((nombreProTotal / 3600) / capaciteArray[10]);

}