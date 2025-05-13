/**
 * Fichier principal pour initialiser et gérer le jeu
 */

// Initialise le jeu au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    initGame();
    updateTeamsCorners(); // Affiche les coins dès le chargement
});

function initGame() {
    // Initialise les gestionnaires d'événements
    setupEventListeners();
    
    // Vérifie s'il y a un état de jeu sauvegardé
    const gameState = getGameState();
    
    // Initialize le premier écran
    showScreen('welcome-screen');
    
    // Précharge les images depuis assets
    preloadAssets();
}

// Précharge les images pour une utilisation ultérieure
function preloadAssets() {
    const ASSETS_PATH = 'assets/';
    const imagesToPreload = [
        '2025-04-04 11_28_03-Window.png',
        '2025-04-04 11_28_21-Window.png',
        '2025-04-04 11_28_36-Window.png',
        '2025-04-04 11_28_55-Window.png',
        '2025-04-04 11_29_21-Window.png',
        '2025-04-04 11_29_51-Window.png'
    ];
    
    imagesToPreload.forEach(imagePath => {
        const img = new Image();
        img.src = ASSETS_PATH + imagePath;
    });
}

function setupEventListeners() {
    // Boutons de navigation entre les écrans
    document.getElementById('start-button').addEventListener('click', () => {
        // Efface complètement le localStorage pour repartir de zéro
        localStorage.clear();
        // Réinitialise l'état du jeu avec les scores à 0
        resetGameState();
        showScreen('team-setup-screen');
    });
    
    document.getElementById('continue-button').addEventListener('click', () => {
                // Réinitialise complètement l'état du jeu avec des scores à 0
                resetGameState();
        // Sauvegarde les informations des équipes avant de continuer
        saveTeamSetup();
         showScreen('dice-screen');
        updateTeamsDisplay();
    });
    
    document.getElementById('roll-dice-button').addEventListener('click', () => {
        // Démarre le timer du jeu dès qu'on lance le dé la première fois
        showScreen('board-screen');
        startGameTimer();
        rollDice();
    });
    
    document.getElementById('roll-button').addEventListener('click', () => {
        rollDice();
    });
    
    document.getElementById('next-turn-button').addEventListener('click', () => {
        nextTurn();
    });
    
    document.getElementById('exit-button').addEventListener('click', () => {
        showExitModal();
    });
    
    // Gestion des modales
    document.getElementById('property-continue').addEventListener('click', () => {
        toggleModal('property-modal', false);
    });
    
    document.getElementById('skip-video').addEventListener('click', () => {
        // Arrête le timer de la vidéo
        if (window.videoTimer) {
            clearInterval(window.videoTimer);
        }
        toggleModal('video-modal', false);
    });
    
    document.getElementById('replay-button').addEventListener('click', () => {
        // Efface complètement le localStorage
        localStorage.clear();
        
        // Réinitialise complètement l'état du jeu avec des scores à 0
        resetGameState();
        
        // Ferme la modale et nettoie les styles
        toggleModal('win-modal', false);
        document.body.classList.remove('win-celebration');
        
        // Revient à l'écran d'accueil
        showScreen('welcome-screen');
        
        // Réinitialise le timer
        if (window.gameTimerInterval) {
            clearInterval(window.gameTimerInterval);
        }
        
        // Réinitialise l'affichage du timer
        const timerElement = document.getElementById('game-timer');
        if (timerElement) {
            timerElement.textContent = "05:00";
            timerElement.classList.remove('warning', 'danger');
        }
        
        console.log("Jeu réinitialisé avec scores à 0, localStorage effacé complètement");
    });
    
    document.getElementById('confirm-exit').addEventListener('click', () => {
        // Ferme la modale
        toggleModal('exit-modal', false);
        
        // Efface tous les données du localStorage
        localStorage.clear();
        
        // Réinitialise complètement l'état du jeu
        resetGameState();
        
        // Arrête le timer si actif
        if (window.gameTimerInterval) {
            clearInterval(window.gameTimerInterval);
        }
        
        // Revient à l'écran d'accueil
        showScreen('welcome-screen');
        
        console.log("Jeu quitté, localStorage effacé");
    });
    
    document.getElementById('cancel-exit').addEventListener('click', () => {
        toggleModal('exit-modal', false);
    });
}

// Sauvegarde les informations des équipes
function saveTeamSetup() {
    const gameState = getGameState();
    
    // Pour chaque carte d'équipe
    document.querySelectorAll('.team-card').forEach(card => {
        const teamId = card.dataset.teamId;
        
        // Récupère les noms des joueurs
        const playerInputs = card.querySelectorAll('.player-input');
        const players = Array.from(playerInputs)
            .map(input => input.value.trim())
            .filter(name => name !== ''); // Filtre les noms vides
        
        // Récupère l'état actif
        const isActive = card.querySelector('input[type="checkbox"]').checked;
        
        // Met à jour l'état du jeu
        if (gameState.teams[teamId]) {
            gameState.teams[teamId].players = players;
            gameState.teams[teamId].active = isActive;
        }
    });
    
    // Après avoir mis à jour toutes les équipes, trouve la première équipe active
    const activeTeamIds = Object.keys(gameState.teams)
        .filter(id => gameState.teams[id].active)
        .map(Number);
    
    if (activeTeamIds.length > 0) {
        gameState.activeTeam = activeTeamIds[0];
    }
    
    // Sauvegarde l'état mis à jour
    updateGameState(gameState);
}

// Gère le lancement du dé
function rollDice() {
    // Désactive le bouton pendant l'animation
    const rollButton = document.getElementById('roll-button');
    if (rollButton) rollButton.disabled = true;
    
    // Affiche le dé en plein écran
    const diceOverlay = document.getElementById('dice-fullscreen-overlay');
    const fullscreenDice = document.getElementById('fullscreen-dice');
    
    // Affiche l'overlay
    diceOverlay.classList.add('show');
    
    // Anime le dé avec des rotations dynamiques
    fullscreenDice.classList.add('rolling');
    
    // Ajouter un effet de tremblement au dé
    if (fullscreenDice.parentElement) {
        fullscreenDice.parentElement.classList.add('shake');
    }
    
    // Ajouter un son de dé qui roule
    try {
        const rollSound = new Audio('../assets/diceland.wav');
        rollSound.volume = 0.5;
        rollSound.play().catch(e => console.log('Pas de son disponible'));
    } catch (e) {
        console.log('Audio non supporté');
    }
    
    // Prolonger la durée de l'animation pour mieux voir le dé tourner
    setTimeout(() => {
        // Génère un nombre aléatoire entre 1 et 6
        const diceValue = getRandomInt(1, 6);
        
        // Arrête l'animation du dé
        fullscreenDice.classList.remove('rolling');
        if (fullscreenDice.parentElement) {
            fullscreenDice.parentElement.classList.remove('shake');
        }
        
        // Met à jour l'affichage du dé en plein écran
        fullscreenDice.setAttribute('data-value', diceValue);
        
        // Met à jour aussi le dé normal (pour la cohérence)
        const normalDice = document.getElementById('dice');
        if (normalDice) {
            normalDice.setAttribute('data-value', diceValue);
        }
        
        // Met à jour l'état du jeu
        updateDiceValue(diceValue);
        updateDiceDisplay(diceValue);
        
        // Joue un son quand le dé s'arrête
        try {
            const landSound = new Audio('../assets/dicelandBG.wav');
            landSound.volume = 0.5;
            landSound.play().catch(e => console.log('Pas de son disponible'));
        } catch (e) {
            console.log('Audio non supporté');
        }
        
        // Après un délai pour montrer le résultat, cache l'overlay
        setTimeout(() => {
            // Cache l'overlay du dé
            diceOverlay.classList.remove('show');
            
            // Si nous sommes sur l'écran de lancement du dé, passe au plateau de jeu
            if (document.getElementById('dice-screen').classList.contains('active-screen')) {
                showScreen('board-screen');
                renderGameBoard();
                updateTeamsDisplay();
            } else {
                // Si nous sommes déjà sur le plateau, déplace le joueur du nombre de cases indiqué par le dé
                // Déplace le joueur du nombre de cases indiqué par le dé
                const updatedState = movePlayer(diceValue);
                
                // Récupère la carte sur laquelle le joueur est arrivé
                const activeCard = getActiveCardFromPosition();
                
                // Met à jour l'affichage du plateau
                renderGameBoard();
                
                // Applique l'effet de la carte
                handleCellClick(activeCard.id, activeCard.type);
                
                // Réactive le bouton
                if (rollButton) rollButton.disabled = false;
            }
        }, 1500);
    }, 2500); // Augmenté à 2.5 secondes pour voir le dé qui tourne plus longtemps
}

// Passe au tour suivant
function nextTurn() {
    const gameState = advanceTurn();
    updateTeamsDisplay();
    updatePlayerList(); // Update the player list display
    updateTeamsCorners(); // Met à jour l'affichage des coins

    // Réactive le bouton de lancer de dé
    const rollButton = document.getElementById('roll-button');
    if (rollButton) rollButton.disabled = false;
    
    // Vérifier si une équipe a atteint le score de victoire (2000 points)
    const winningTeam = Object.values(gameState.teams).find(team => team.active && team.score >= 2000);
    
    if (winningTeam) {
        showWinModal(winningTeam.score, winningTeam.name);
    }
    
    // Vérifier si le temps restant est inférieur à 30 secondes
    if (gameState.gameTime <= 30) {
        // Ajouter une alerte visuelle
        const timerElement = document.getElementById('game-timer');
        if (timerElement) {
            timerElement.classList.add('danger');
        }
    }
}

// Gère le clic sur une cellule du plateau
function handleCellClick(cellId, cellType) {
    const gameState = getGameState();
    setActiveCard(cellId);
    
    switch (cellType) {
        case CARD_TYPES.PROPERTY:
            handlePropertyCard();
            break;
        case CARD_TYPES.BONUS:
            handleBonusCard();
            break;
        case CARD_TYPES.FACTURE:
            handleFactureCard();
            break;
        case CARD_TYPES.INTERACTION:
            handleInteractionCard();
            break;
        case CARD_TYPES.BIENS:
            handleBiensCard();
            break;
        case CARD_TYPES.PDB:
            handlePDBCard();
            break;
    }
}

// Gestion des cartes selon leur type
function handlePropertyCard() {
    const property = getRandomProperty();
    showPropertyModal(property);
    
    // Ajoute la valeur de la propriété au score de l'équipe
    const gameState = getGameState();
    updateTeamScore(gameState.activeTeam, property.value);
    updateTeamsDisplay();
}

function handleBonusCard() {
    const bonus = getRandomBonus();
    const isPositive = bonus > 0;
    
    // Met à jour le texte et le montant dans la modale
    document.getElementById('bonus-text').textContent = isPositive 
        ? 'Vous avez gagné' 
        : 'Vous avez perdu';
    
    document.getElementById('bonus-amount').textContent = isPositive 
        ? `+${bonus} K` 
        : `-${Math.abs(bonus)} K`;
    
    // Applique une classe spécifique selon si c'est positif ou négatif
    const amountElement = document.getElementById('bonus-amount');
    if (isPositive) {
        amountElement.classList.remove('danger-amount');
    } else {
        amountElement.classList.add('danger-amount');
    }
    
    // Affiche la modale bonus
    toggleModal('bonus-modal', true);
    
    // Quand l'utilisateur clique sur continuer, ferme la modale et met à jour le score
    document.getElementById('bonus-continue').onclick = () => {
        toggleModal('bonus-modal', false);
        
        // Ajoute ou retire le montant du score de l'équipe
        const gameState = getGameState();
        updateTeamScore(gameState.activeTeam, bonus);
        updateTeamsDisplay();
    };
}

function handleFactureCard() {
    const facture = getRandomInt(5, 15) * 10;
    
    // Met à jour le texte et le montant dans la modale
    document.getElementById('facture-text').textContent = 'Vous devez payer';
    document.getElementById('facture-amount').textContent = `-${facture} K`;
    
    // Affiche la modale facture
    toggleModal('facture-modal', true);
    
    // Quand l'utilisateur clique sur payer, ferme la modale et met à jour le score
    document.getElementById('facture-continue').onclick = () => {
        toggleModal('facture-modal', false);
        
        // Retire le montant du score de l'équipe
        const gameState = getGameState();
        updateTeamScore(gameState.activeTeam, -facture);
        updateTeamsDisplay();
    };
}

function handleInteractionCard() {
    // Affiche d'abord la vidéo
    showVideoModal('00:15');
    
    // Après la vidéo, affiche la modale d'interaction
    document.getElementById('skip-video').onclick = () => {
        toggleModal('video-modal', false);
        
        // Réinitialise le sélecteur d'équipes
        const interactionTeamsContainer = document.getElementById('interaction-teams');
        interactionTeamsContainer.innerHTML = '';
        
        // Récupère la liste des équipes actives autres que celle qui joue
        const gameState = getGameState();
        const activeTeams = Object.entries(gameState.teams)
            .filter(([id, team]) => team.active && parseInt(id) !== gameState.activeTeam);
        
        // S'il y a d'autres équipes actives, affiche les options
        if (activeTeams.length > 0) {
            activeTeams.forEach(([id, team]) => {
                const teamOption = document.createElement('div');
                teamOption.className = `team-option team${id}-bg`;
                teamOption.textContent = team.name;
                teamOption.dataset.teamId = id;
                teamOption.onclick = () => handleTeamInteraction(parseInt(id));
                interactionTeamsContainer.appendChild(teamOption);
            });
            
            // Affiche la modale d'interaction
            toggleModal('interaction-modal', true);
            
            // Option pour passer
            document.getElementById('interaction-skip').onclick = () => {
                toggleModal('interaction-modal', false);
                
                // Bonus par défaut
                const defaultBonus = 50;
                updateTeamScore(gameState.activeTeam, defaultBonus);
                updateTeamsDisplay();
            };
        } else {
            // S'il n'y a pas d'autres équipes actives, donne un bonus direct
            const bonus = getRandomInt(1, 3) * 50;
            
            // Met à jour le texte et le montant dans la modale bonus
            document.getElementById('bonus-text').textContent = 'Vous avez gagné';
            document.getElementById('bonus-amount').textContent = `+${bonus} K`;
            document.getElementById('bonus-amount').classList.remove('danger-amount');
            
            // Affiche la modale bonus
            toggleModal('bonus-modal', true);
            
            // Quand l'utilisateur clique sur continuer, ferme la modale et met à jour le score
            document.getElementById('bonus-continue').onclick = () => {
                toggleModal('bonus-modal', false);
                updateTeamScore(gameState.activeTeam, bonus);
                updateTeamsDisplay();
            };
        }
    };
}

// Gère l'interaction entre deux équipes
function handleTeamInteraction(targetTeamId) {
    const gameState = getGameState();
    const activeTeamId = gameState.activeTeam;
    const amount = 100; // Montant à échanger
    
    // Transfère de l'équipe cible vers l'équipe active
    updateTeamScore(activeTeamId, amount);
    updateTeamScore(targetTeamId, -amount);
    
    // Ferme la modale d'interaction
    toggleModal('interaction-modal', false);
    
    // Met à jour l'affichage des équipes
    updateTeamsDisplay();
}

function handleBiensCard() {
    const amount = getRandomInt(1, 5) * 30;
    
    // Met à jour le texte et le montant dans la modale
    document.getElementById('biens-text').textContent = 'Vous recevez un loyer de tous vos biens';
    document.getElementById('biens-amount').textContent = `+${amount} K`;
    
    // Affiche la modale biens
    toggleModal('biens-modal', true);
    
    // Quand l'utilisateur clique sur encaisser, ferme la modale et met à jour le score
    document.getElementById('biens-continue').onclick = () => {
        toggleModal('biens-modal', false);
        
        // Ajoute le montant au score de l'équipe
        const gameState = getGameState();
        updateTeamScore(gameState.activeTeam, amount);
        updateTeamsDisplay();
    };
}

function handlePDBCard() {
    // Simule un effet aléatoire du PDB
    const effects = [
        {message: "Réunion de copropriété", amount: -30},
        {message: "Dividendes reçus", amount: 100},
        {message: "Taxe foncière", amount: -50},
        {message: "Revenus locatifs", amount: 80}
    ];
    
    const effect = effects[getRandomInt(0, effects.length - 1)];
    const isPositive = effect.amount > 0;
    
    // Met à jour le texte et le montant dans la modale
    document.getElementById('pdb-text').textContent = effect.message;
    document.getElementById('pdb-amount').textContent = isPositive 
        ? `+${effect.amount} K` 
        : `-${Math.abs(effect.amount)} K`;
    
    // Applique une classe spécifique selon si c'est positif ou négatif
    const amountElement = document.getElementById('pdb-amount');
    if (isPositive) {
        amountElement.classList.remove('danger-amount');
    } else {
        amountElement.classList.add('danger-amount');
    }
    
    // Affiche la modale PDB
    toggleModal('pdb-modal', true);
    
    // Quand l'utilisateur clique sur payer, ferme la modale et met à jour le score
    document.getElementById('pdb-continue').onclick = () => {
        toggleModal('pdb-modal', false);
        
        // Applique l'effet au score de l'équipe
        const gameState = getGameState();
        updateTeamScore(gameState.activeTeam, effect.amount);
        updateTeamsDisplay();
    };
}
