/**
 * Ce fichier gère l'animation de retournement des cartes directement sur les modals
 */

// Tableau de correspondance entre les types de carte et les IDs des modals
const CARD_MODAL_MAP = {
    'property': 'property-modal',
    'bonus': 'bonus-modal',
    'facture': 'facture-modal',
    'biens': 'biens-modal',
    'pdb': 'pdb-modal',
    'interaction': 'interaction-modal'
};

/**
 * Convertit un modal standard en une carte flip et l'affiche
 * @param {string} cardType - Le type de carte ('bonus', 'facture', etc.)
 * @param {Function} onFlipComplete - Callback exécuté une fois que la carte est retournée
 */
function showFlipCardModal(cardType) {
    console.log(`Starting flip card modal for type: ${cardType}`);
    
    // Récupère l'ID du modal correspondant au type de carte
    const modalId = CARD_MODAL_MAP[cardType.toLowerCase()];
    if (!modalId) {
        console.error(`No modal ID found for card type: ${cardType}`);
        return;
    }

    // Récupère l'élément du modal
    const modal = document.getElementById(modalId);
    if (!modal) {
        console.error(`Modal element not found: ${modalId}`);
        return;
    }

    console.log(`Found modal: ${modalId}`);

    // Ajoute les classes pour transformer le modal en carte flip
    modal.classList.add('card-modal');
    modal.classList.add(cardType.toLowerCase());

    // Récupère le contenu du modal existant
    const modalContent = modal.querySelector('.modal-content');
    
    console.log(`Modal content found:`, modalContent);

    // Crée une copie du contenu existant pour la face arrière
    const cardBack = document.createElement('div');
    cardBack.className = 'card-back';
    
    // Déplace tous les enfants du contenu du modal dans la face arrière
    while (modalContent.firstChild) {
        cardBack.appendChild(modalContent.firstChild);
    }

    // Crée la face avant de la carte
    const cardFront = document.createElement('div');
    cardFront.className = 'card-front';
    
    // Ajoute le logo à la face avant
    const cardLogo = document.createElement('div');
    cardLogo.className = 'card-logo';
    cardLogo.innerHTML = `
        <svg width="120" height="120" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="200" height="200" rx="20" fill="#1e3799"/>
            <path d="M50 50 L150 50 L150 150 L50 150 Z" stroke="#f6b93b" stroke-width="8" fill="none"/>
            <path d="M70 70 L130 70 L130 130 L70 130 Z" stroke="#f6b93b" stroke-width="4" fill="none"/>
            <text x="100" y="180" text-anchor="middle" fill="#f6b93b" font-family="Arial" font-weight="bold" font-size="20">LBG</text>
        </svg>
    `;
    cardFront.appendChild(cardLogo);
    
    // Ajoute le type de carte sur la face avant
    const cardType_label = document.createElement('div');
    cardType_label.className = 'card-type';
    cardType_label.textContent = cardTypeToName(cardType);
    cardFront.appendChild(cardType_label);
    
    // Ajoute les faces à l'élément modal-content
    modalContent.appendChild(cardFront);
    modalContent.appendChild(cardBack);
    
    console.log(`Added card front and back to modal content`);
      // Affiche le modal
    modal.style.display = 'block';
    
    console.log(`Modal displayed, will flip in 2.5 seconds`);
    
    // Joue un son quand la carte apparaît
    try {
        const cardSound = new Audio('../assets/card-appear.wav');
        cardSound.volume = 0.5;
        cardSound.play().catch(e => console.log('Pas de son disponible'));
    } catch (e) {
        console.log('Audio non supporté');
    }

    // Attendre 2.5 secondes pour que l'utilisateur puisse voir la face avant
    setTimeout(() => {
        console.log(`Starting flip animation - adding flipped class`);
        
        // Force un reflow avant d'ajouter la classe pour s'assurer de l'état initial
        const initialTransform = window.getComputedStyle(modalContent).transform;
        console.log(`Initial transform:`, initialTransform);
        
        modalContent.classList.add('flipped');
        
        // Vérification immédiate
        console.log(`Modal content classes after flip:`, modalContent.className);
        
        // Force un reflow pour déclencher l'animation
        modalContent.offsetHeight;
        
        // Vérification du transform après un délai
        setTimeout(() => {
            const finalTransform = window.getComputedStyle(modalContent).transform;
            console.log(`Final transform after 0.8s:`, finalTransform);
        }, 800);
        
        // Joue un son quand la carte se retourne
        try {
            const flipSound = new Audio('../assets/card-flip.wav');
            flipSound.volume = 0.5;
            flipSound.play().catch(e => console.log('Pas de son disponible'));
        } catch (e) {
            console.log('Audio non supporté');
        }
    }, 1200); // Augmenté à 1.2s pour laisser voir la face avant
}

/**
 * Ferme le modal card-flip et réinitialise sa structure
 * @param {string} modalId - L'ID du modal à fermer
 */
function closeFlipCardModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    
    const modalContent = modal.querySelector('.modal-content');
    
    // Retire la classe flipped
    modalContent.classList.remove('flipped');
    
    // Masque le modal après l'animation de retour
    setTimeout(() => {
        modal.style.display = 'none';
        
        // Nettoie la structure du modal
        cleanupModalStructure(modal);
        
        // Retire les classes card-modal et type de carte
        modal.classList.remove('card-modal');
        Object.values(CARD_MODAL_MAP).forEach(type => {
            modal.classList.remove(type);
        });
    }, 800);
}

/**
 * Nettoie la structure du modal pour le réinitialiser à son état d'origine
 * @param {HTMLElement} modal - L'élément modal à nettoyer
 */
function cleanupModalStructure(modal) {
    const modalContent = modal.querySelector('.modal-content');
    const cardBack = modal.querySelector('.card-back');
    const cardFront = modal.querySelector('.card-front');
    
    // Déplace tous les enfants de card-back vers modal-content
    if (cardBack) {
        while (cardBack.firstChild) {
            modalContent.appendChild(cardBack.firstChild);
        }
        
        // Supprime les éléments de structure de la carte
        if (cardBack) modalContent.removeChild(cardBack);
        if (cardFront) modalContent.removeChild(cardFront);
    }
}

/**
 * Convertit un type de carte en nom lisible
 * @param {string} cardType - Le type de carte
 * @return {string} Le nom lisible de la carte
 */
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
