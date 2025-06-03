/**
 * Ce fichier gère l'animation de retournement des cartes
 */

// Fonction pour afficher une carte avec animation de flip
function showCardAnimation(cardType, callback) {
    // Créer l'overlay qui assombrit l'écran
    const overlay = document.createElement('div');
    overlay.className = 'card-overlay';
    document.body.appendChild(overlay);

    // Créer le conteneur de la carte
    const cardContainer = document.createElement('div');
    cardContainer.className = 'card-container';
    overlay.appendChild(cardContainer);

    // Créer l'élément de la carte avec recto/verso
    const cardFlip = document.createElement('div');
    cardFlip.className = 'card-flip';
    cardContainer.appendChild(cardFlip);

    // Ajouter le recto de la carte (face cachée, design générique)
    const cardFront = document.createElement('div');
    cardFront.className = 'card-front';
    cardFlip.appendChild(cardFront);

    // Ajouter le logo au recto
    const cardLogo = document.createElement('div');
    cardLogo.className = 'card-logo';
    cardLogo.innerHTML = `
        <svg width="100" height="100" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="200" height="200" rx="20" fill="#1e3799"/>
            <path d="M50 50 L150 50 L150 150 L50 150 Z" stroke="#f6b93b" stroke-width="8" fill="none"/>
            <path d="M70 70 L130 70 L130 130 L70 130 Z" stroke="#f6b93b" stroke-width="4" fill="none"/>
            <text x="100" y="180" text-anchor="middle" fill="#f6b93b" font-family="Arial" font-weight="bold" font-size="20">PDB</text>
        </svg>
    `;
    cardFront.appendChild(cardLogo);

    // Ajouter le verso de la carte (face visible)
    const cardBack = document.createElement('div');
    cardBack.className = `card-back ${cardType.toLowerCase()}`;
    cardFlip.appendChild(cardBack);

    // Ajouter l'icône correspondant au type de carte
    const cardBackIcon = document.createElement('div');
    cardBackIcon.className = 'card-back-icon';
    
    // On ajoute l'icône en fonction du type de carte
    switch(cardType.toLowerCase()) {
        case 'bonus':
            cardBackIcon.innerHTML = `
                <svg viewBox="0 0 1024 1024" class="icon" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#ffffff" width="60" height="60"><path d="M902.3 517.4l-3.2 4.9c-0.6 1-63.7 96.2-145 209.5-62.8 87.5-135.9 99.1-170.5 99.1-11.6 0-18.9-1.3-20.1-1.5H356l-14.5-14.3h223.4c5.4 0.9 99.1 17.3 177.5-91.7 70.5-98.1 127-182.5 141.2-203.8-10.2-8.3-43-35.2-74.6-30.1-10.2 1.7-25.6 13.2-42.5 29.9l-2.3-2.3v-16.9c16.2-13.8 31.3-23.1 42.6-24.9 47.3-7.7 89.6 36.4 91.2 38l4.3 4.1z" fill="#ffffff"></path><path d="M883.6 519.6c-14.2 21.4-70.7 105.8-141.2 203.8-78.4 109-172.1 92.6-177.5 91.7H341.5L186.8 661.9C200.6 638.4 274 530.7 440 582c7.5 6.3 44.5 31.2 130.8 11.3 11.6-2.7 21.7-3.8 30.6-3.8 26.7 0 41.6 10.5 49.6 20.8 13.7 17.4 13.7 41.3 6.8 55.1-14.1 28.1-37.5 40.6-75.8 40.6H454.5v14.3H582c44 0 72.1-15.5 88.7-48.6 3.2-6.5 5.2-14.8 5.6-23.7l0.1 0.3c13.4-36.6 55-94 90.2-128.9 16.9-16.8 32.2-28.3 42.5-29.9 31.5-5.1 64.3 21.7 74.5 30.1z" fill="#ffffff"></path></svg>
            `;
            break;
        case 'facture':
            cardBackIcon.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 448 448" xml:space="preserve">
                    <path style="fill:#FFFFFF;" d="M43,51v363.9l52.3-55.2l0.1-0.1c0.3-0.1,0.8-0.2,1.4-0.2c0.4,0,1.4,0.3,2,0.9l53.9,59l54.4-33.7  l0.4-0.4c0,0,0.1-0.1,0.4-0.1c0.6,0,1.4,0.3,2,0.6l45.5,33.2l38-50c0.6-0.6,1.5-1.5,1.8-1.5h0.8c0.9,0,1.3,0.1,2.1,0.9l62.2,59.7  l44.7-50.1V51H43z"/>
                </svg>
            `;
            break;
        case 'biens':
            cardBackIcon.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 486 511.942" fill="#FFFFFF">
                    <path fill-rule="nonzero" d="M244.264 125.225c16.524 0 29.977 13.472 29.977 29.977 0 16.531-13.461 29.975-29.977 29.975-8.275 0-15.77-3.357-21.194-8.781-5.424-5.425-8.782-12.92-8.782-21.194 0-8.275 3.358-15.771 8.782-21.195 5.424-5.425 12.919-8.782 21.194-8.782z"/>
                </svg>
            `;
            break;
        case 'pdb':
            cardBackIcon.innerHTML = `
                <svg width="60" height="60" viewBox="0 0 69 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M34.5 21C42.5 21 49 16.5 49 11C49 5.5 42.5 1 34.5 1C26.5 1 20 5.5 20 11C20 16.5 26.5 21 34.5 21Z" stroke="white" stroke-width="2" fill="none"/>
                    <path d="M20 30L49 30" stroke="white" stroke-width="2"/>
                    <path d="M25 38L44 38" stroke="white" stroke-width="2"/>
                </svg>
            `;
            break;
        case 'interaction':
            cardBackIcon.innerHTML = `
                <svg width="60" height="60" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4C12.9543 4 4 12.9543 4 24C4 35.0457 12.9543 44 24 44Z" stroke="white" stroke-width="2" fill="none"/>
                    <path d="M24 35C30.0751 35 35 30.0751 35 24C35 17.9249 30.0751 13 24 13C17.9249 13 13 17.9249 13 24C13 30.0751 17.9249 35 24 35Z" stroke="white" stroke-width="2" fill="none"/>
                </svg>
            `;
            break;
        case 'property':
            cardBackIcon.innerHTML = `
                <svg viewBox="0 0 24 24" width="60" height="60">
                    <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"></path>
                </svg>
            `;
            break;
    }
    
    cardBack.appendChild(cardBackIcon);

    // Titre de la carte
    const cardTitle = document.createElement('div');
    cardTitle.className = 'card-type';
    cardTitle.textContent = cardTypeToName(cardType);
    cardBack.appendChild(cardTitle);

    // Jouer un son quand la carte apparaît
    try {
        const cardSound = new Audio('../assets/card-appear.wav');
        cardSound.volume = 0.5;
        cardSound.play().catch(e => console.log('Pas de son disponible'));
    } catch (e) {
        console.log('Audio non supporté');
    }

    // Attendre que l'animation d'apparition soit terminée
    setTimeout(() => {
        // Retourner la carte après un court délai
        cardFlip.classList.add('flipped');

        // Jouer un son quand la carte se retourne
        try {
            const flipSound = new Audio('../assets/card-flip.wav');
            flipSound.volume = 0.5;
            flipSound.play().catch(e => console.log('Pas de son disponible'));
        } catch (e) {
            console.log('Audio non supporté');
        }

        // Attendre que l'animation de flip soit terminée
        setTimeout(() => {
            // Supprimer l'animation de carte
            document.body.removeChild(overlay);
            
            // Exécuter le callback (montrer la modale)
            if (typeof callback === 'function') {
                callback();
            }
        }, 1500); // Correspond à la durée du flip + un peu plus pour voir le résultat
    }, 800);
}

// Fonction pour convertir le type de carte en nom lisible
function cardTypeToName(cardType) {
    const types = {
        'bonus': 'Carte Bonus',
        'facture': 'Carte Facture',
        'biens': 'Carte Biens',
        'pdb': 'Pas de Bol',
        'interaction': 'Interaction',
        'property': 'Propriété'
    };
    
    return types[cardType.toLowerCase()] || cardType;
}
