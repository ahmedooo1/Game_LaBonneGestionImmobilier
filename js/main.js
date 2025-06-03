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

let dicelandBG;
let landSound;

function blamSoundEffect(){

    // Joue un son quand le dé s'arrête
    try {
       landSound = new Audio('../assets/blam.wav');
       landSound.volume = 0.5;
      
       landSound.play().catch(e => console.log('Pas de son disponible'));
   } catch (e) {
       console.log('Audio non supporté');
   }
}


function setupEventListeners() {
    // Boutons de navigation entre les écrans
    document.getElementById('start-button').addEventListener('click', () => {
        
  
        // Efface complètement le localStorage pour repartir de zéro
        localStorage.clear();
        // Réinitialise l'état du jeu avec les scores à 0
        resetGameState();
        showScreen('team-setup-screen');


        if (dicelandBG) {
            dicelandBG.pause();
            dicelandBG.currentTime = 0; // Réinitialise le temps de lecture à 0
        }
             // Joue un son quand le dé s'arrête
             try {
                landSound = new Audio('../assets/bigenGame.wav');
                landSound.volume = 0.5;
            
                landSound.play().catch(e => console.log('Pas de son disponible'));
            } catch (e) {
                console.log('Audio non supporté');
            }
            const rollButton = document.getElementById('roll-button');
            rollButton.style.display = "none";
 
    });   

    document.getElementById('continue-button').addEventListener('click', () => {

   
        if (landSound) {
            landSound.pause();
            landSound.currentTime = 0; // Réinitialise le temps de lecture à 0
        }
             // Joue un son quand le dé s'arrête
             blamSoundEffect();

                // Réinitialise complètement l'état du jeu avec des scores à 0
                resetGameState();
        // Sauvegarde les informations des équipes avant de continuer
        saveTeamSetup();
         showScreen('dice-screen');
        updateTeamsDisplay();
    });
    
    document.getElementById('roll-dice-button').addEventListener('click', () => {
        blamSoundEffect();
        // Joue un son quand le dé s'arrête
        dicelandBGSound();
        // Démarre le timer du jeu dès qu'on lance le dé la première fois
        showScreen('board-screen');
        startGameTimer();
        rollDice();
    });
    
    document.getElementById('roll-button').addEventListener('click', () => {

        blamSoundEffect();
        rollDice();


        const rollButton = document.getElementById('roll-button');
         rollButton.style.display = "none";
         const nextButton = document.getElementById('next-turn-button');
         nextButton.style.display = "block";
    });
    
    document.getElementById('next-turn-button').addEventListener('click', () => {
        blamSoundEffect();
        nextTurn();
        const rollButton = document.getElementById('roll-button');
        rollButton.style.display = "block";
        const nextButton = document.getElementById('next-turn-button');
        nextButton.style.display = "none";
    });
    
    document.getElementById('exit-button').addEventListener('click', () => {
        blamSoundEffect();
        showExitModal();
    });
    
    // Gestion des modales
    document.getElementById('property-continue').addEventListener('click', () => {
        blamSoundEffect();
        toggleModal('property-modal', false);
    });
    
    document.getElementById('skip-video').addEventListener('click', () => {
        blamSoundEffect();
        // Arrête le timer de la vidéo
        if (window.videoTimer) {
            clearInterval(window.videoTimer);
        }
        toggleModal('video-modal', false);
    });
    
    document.getElementById('replay-button').addEventListener('click', () => {
        blamSoundEffect();
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
        blamSoundEffect();

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
        
      
        location.reload();
        // Revient à l'écran d'accueil
        showScreen('welcome-screen');
  
        console.log("Jeu quitté, localStorage effacé");
    });
    
    document.getElementById('cancel-exit').addEventListener('click', () => {
        blamSoundEffect();
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
function dicelandBGSound(){
    try {
        const dicelandBG = new Audio('../assets/dicelandBG.wav');
        dicelandBG.volume = 0.5;
        dicelandBG.onended = function() {
            this.play().catch(e => console.log('Pas de son disponible'));
        };
        dicelandBG.play().catch(e => console.log('Pas de son disponible'));
    } catch (e) {
        console.log('Audio non supporté');
    }
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
        
 
        
        // Après un délai pour montrer le résultat, cache l'overlay
        setTimeout(() => {
            // Cache l'overlay du dé
            diceOverlay.classList.remove('show');
                         // Joue un son quand le dé s'arrête
                         try {
                            landSound = new Audio('../assets/trn.wav');
                            landSound.volume = 0.5;
                           
                            landSound.play().catch(e => console.log('Pas de son disponible'));
                        } catch (e) {
                            console.log('Audio non supporté');
                        }
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
    // Utilise les données des cartes bonus
    const bonusCard = getRandomCard('bonus');
    
    // Affiche le titre de la carte
    document.getElementById('bonus-text').textContent = bonusCard.title;
    
    // Gestion des effets spéciaux ou des montants
    if (bonusCard.type === 'special') {
        // Pour les cartes à effets spéciaux
        let effectText = '';
        
        switch (bonusCard.effect) {
            case 'increase':
                effectText = `+${bonusCard.value}% sur votre prochaine transaction`;
                break;
            case 'no_rent':
                effectText = 'Pas de loyer au prochain tour';
                break;
            default:
                effectText = 'Effet spécial';
        }
        
        document.getElementById('bonus-amount').textContent = effectText;
    } else {
        // Pour les cartes avec un montant
        const amount = bonusCard.amount || 0;
        document.getElementById('bonus-amount').textContent = `+${amount} K`;
    }
    
    // Toujours positif pour un bonus
    document.getElementById('bonus-amount').classList.remove('danger-amount');
    
    // Affiche la description si disponible
    const descriptionElement = document.getElementById('bonus-description');
    if (descriptionElement) {
        descriptionElement.textContent = bonusCard.description || '';
        descriptionElement.style.display = bonusCard.description ? 'block' : 'none';
    }
    
    // Affiche la modale bonus
    toggleModal('bonus-modal', true);
    
    // Quand l'utilisateur clique sur continuer, ferme la modale et applique l'effet
    document.getElementById('bonus-continue').onclick = () => {
        toggleModal('bonus-modal', false);
        
        const gameState = getGameState();
        
        // Applique l'effet selon le type de carte
        if (bonusCard.type === 'special') {
            // Sauvegarde l'effet spécial pour l'équipe active
            const teamState = gameState.teams[gameState.activeTeam];
            if (!teamState.effects) teamState.effects = [];
            
            teamState.effects.push({
                type: bonusCard.effect,
                value: bonusCard.value,
                applied: false
            });
            
            updateGameState(gameState);
        } else if (bonusCard.amount) {
            // Applique le montant au score
            updateTeamScore(gameState.activeTeam, bonusCard.amount);
        }
        
        updateTeamsDisplay();
    };
}

function handleFactureCard() {
    // Utilise les données des cartes de facturation
    const factureCard = getRandomCard('facture');
    const amount = factureCard.amount || getRandomInt(10, 50); // Utilise un montant par défaut si nécessaire
    
    // Met à jour le texte et le montant dans la modale
    document.getElementById('facture-text').textContent = factureCard.title;
    document.getElementById('facture-amount').textContent = `-${amount} K`;
    
    // Si il y a une description, l'afficher
    const descriptionElement = document.getElementById('facture-description');
    if (descriptionElement) {
        descriptionElement.textContent = factureCard.description || '';
        descriptionElement.style.display = factureCard.description ? 'block' : 'none';
    }
    
    // Affiche la modale facture
    toggleModal('facture-modal', true);
    
    // Quand l'utilisateur clique sur payer, ferme la modale et met à jour le score
    document.getElementById('facture-continue').onclick = () => {
        toggleModal('facture-modal', false);
        
        // Retire le montant du score de l'équipe
        const gameState = getGameState();
        updateTeamScore(gameState.activeTeam, -amount);
        updateTeamsDisplay();
    };
}

function handleInteractionCard() {
    // Utilise les données des cartes d'interaction
    const interactionCard = getRandomCard('interaction');
    
    // Affiche d'abord la vidéo si nécessaire
    showVideoModal('00:15');
    
    // Variable pour stocker la carte pour utilisation après la vidéo
    const gameState = getGameState();
    gameState.currentInteractionCard = interactionCard;
    updateGameState(gameState);
    
    // Après la vidéo, traite la carte d'interaction
    document.getElementById('skip-video').onclick = () => {
        toggleModal('video-modal', false);
        
        // Récupère la carte d'interaction actuelle
        const currentState = getGameState();
        const card = currentState.currentInteractionCard;
        
        // Si c'est une carte qui affecte une autre équipe
        if (card.type === 'team_effect') {
            // Réinitialise le sélecteur d'équipes
            const interactionTeamsContainer = document.getElementById('interaction-teams');
            interactionTeamsContainer.innerHTML = '';
            
            // Met à jour le titre et la description de l'interaction
            document.getElementById('interaction-title').textContent = card.title || 'Interaction';
            document.getElementById('interaction-description').textContent = card.description || '';
            
            // Récupère la liste des équipes actives autres que celle qui joue
            const activeTeams = Object.entries(currentState.teams)
                .filter(([id, team]) => team.active && parseInt(id) !== currentState.activeTeam);
            
            // S'il y a d'autres équipes actives, affiche les options
            if (activeTeams.length > 0) {
                activeTeams.forEach(([id, team]) => {
                    const teamOption = document.createElement('div');
                    teamOption.className = `team-option team${id}-bg`;
                    teamOption.textContent = team.name;
                    teamOption.dataset.teamId = id;
                    teamOption.dataset.effect = card.effect;
                    teamOption.dataset.value = card.value;
                    teamOption.onclick = () => handleTeamInteraction(parseInt(id), card.effect, card.value);
                    interactionTeamsContainer.appendChild(teamOption);
                });
                
                // Affiche la modale d'interaction
                toggleModal('interaction-modal', true);
                
                // Option pour passer
                document.getElementById('interaction-skip').onclick = () => {
                    toggleModal('interaction-modal', false);
                    
                    // Bonus par défaut si la carte a un montant
                    if (card.amount) {
                        updateTeamScore(currentState.activeTeam, card.amount);
                    } else {
                        // Bonus par défaut si pas de montant spécifié
                        const defaultBonus = 50;
                        updateTeamScore(currentState.activeTeam, defaultBonus);
                    }
                    
                    updateTeamsDisplay();
                };
            } else {
                // S'il n'y a pas d'autres équipes actives, donne un bonus direct
                const amount = card.amount || getRandomInt(1, 3) * 50;
                
                // Met à jour le texte et le montant dans la modale bonus
                document.getElementById('bonus-text').textContent = card.title || 'Bonus';
                document.getElementById('bonus-amount').textContent = `+${amount} K`;
                document.getElementById('bonus-amount').classList.remove('danger-amount');
                
                // Affiche la description si disponible
                const bonusDescElement = document.getElementById('bonus-description');
                if (bonusDescElement) {
                    bonusDescElement.textContent = card.description || '';
                    bonusDescElement.style.display = card.description ? 'block' : 'none';
                }
                
                // Affiche la modale bonus
                toggleModal('bonus-modal', true);
                
                // Quand l'utilisateur clique sur continuer, ferme la modale et met à jour le score
                document.getElementById('bonus-continue').onclick = () => {
                    toggleModal('bonus-modal', false);
                    updateTeamScore(currentState.activeTeam, amount);
                    updateTeamsDisplay();
                };
            }
        } else {
            // Pour les cartes qui n'affectent pas une autre équipe
            const amount = card.amount || getRandomInt(10, 50);
            
            // Si c'est un coût, utilise la modale facture
            if (card.type === 'cost') {
                document.getElementById('facture-text').textContent = card.title || 'Coût';
                document.getElementById('facture-amount').textContent = `-${amount} K`;
                
                // Affiche la description si disponible
                const factureDescElement = document.getElementById('facture-description');
                if (factureDescElement) {
                    factureDescElement.textContent = card.description || '';
                    factureDescElement.style.display = card.description ? 'block' : 'none';
                }
                
                // Affiche la modale facture
                toggleModal('facture-modal', true);
                
                // Quand l'utilisateur clique sur payer, ferme la modale et met à jour le score
                document.getElementById('facture-continue').onclick = () => {
                    toggleModal('facture-modal', false);
                    updateTeamScore(currentState.activeTeam, -amount);
                    updateTeamsDisplay();
                };
            } else {
                // Sinon utilise la modale bonus
                document.getElementById('bonus-text').textContent = card.title || 'Bonus';
                document.getElementById('bonus-amount').textContent = `+${amount} K`;
                document.getElementById('bonus-amount').classList.remove('danger-amount');
                
                // Affiche la description si disponible
                const bonusDescElement = document.getElementById('bonus-description');
                if (bonusDescElement) {
                    bonusDescElement.textContent = card.description || '';
                    bonusDescElement.style.display = card.description ? 'block' : 'none';
                }
                
                // Affiche la modale bonus
                toggleModal('bonus-modal', true);
                
                // Quand l'utilisateur clique sur continuer, ferme la modale et met à jour le score
                document.getElementById('bonus-continue').onclick = () => {
                    toggleModal('bonus-modal', false);
                    updateTeamScore(currentState.activeTeam, amount);
                    updateTeamsDisplay();
                };
            }
        }
    };
}

// Gère l'interaction entre deux équipes
function handleTeamInteraction(targetTeamId, effect, value) {
    const gameState = getGameState();
    const activeTeamId = gameState.activeTeam;
    
    // Ferme la modale d'interaction
    toggleModal('interaction-modal', false);
    
    // Traite l'effet selon son type
    if (effect === 'team_increase' || effect === 'team_reduction') {
        // Ajoute un effet à l'équipe cible
        if (!gameState.teams[targetTeamId].effects) {
            gameState.teams[targetTeamId].effects = [];
        }
        
        gameState.teams[targetTeamId].effects.push({
            type: effect,
            value: value,
            applied: false,
            source: activeTeamId // L'équipe qui a appliqué cet effet
        });
        
        updateGameState(gameState);
        
        // Affiche un message pour confirmer l'action
        const targetTeamName = gameState.teams[targetTeamId].name;
        const effectText = effect === 'team_increase' 
            ? `augmenter de ${value}%` 
            : `réduire de ${value}%`;
        
        alert(`La prochaine facture de ${targetTeamName} va ${effectText}.`);
    } else {
        // Comportement par défaut : transfert d'argent
        const amount = value || 100; // Montant par défaut si non spécifié
        
        // Transfère de l'équipe cible vers l'équipe active
        updateTeamScore(activeTeamId, amount);
        updateTeamScore(targetTeamId, -amount);
    }
    
    // Met à jour l'affichage des équipes
    updateTeamsDisplay();
}

/**
 * Gère l'affichage et le traitement des cartes Biens
 */
function handleBiensCard() {
    // Utilise les données des cartes biens
    const biensCard = getRandomCard('biens');
    
    // Met à jour le texte dans la modale
    document.getElementById('biens-text').textContent = biensCard.title;
    document.getElementById('biens-amount').textContent = `+${biensCard.value} K`;
    
    // Affiche la description si disponible
    const descriptionElement = document.getElementById('biens-description');
    if (descriptionElement) {
        descriptionElement.textContent = biensCard.description || '';
        descriptionElement.style.display = biensCard.description ? 'block' : 'none';
    }
    
    // Affiche la modale biens
    toggleModal('biens-modal', true);
    
    // Quand l'utilisateur clique sur encaisser, ferme la modale et met à jour le score
    document.getElementById('biens-continue').onclick = () => {
        toggleModal('biens-modal', false);
        
        // Ajoute la valeur du bien au score de l'équipe
        const gameState = getGameState();
        updateTeamScore(gameState.activeTeam, biensCard.value);
        
        // Ajoute le bien à la liste des biens de l'équipe
        if (!gameState.teams[gameState.activeTeam].properties) {
            gameState.teams[gameState.activeTeam].properties = [];
        }
        
        gameState.teams[gameState.activeTeam].properties.push({
            id: biensCard.id,
            title: biensCard.title,
            description: biensCard.description,
            value: biensCard.value
        });
        
        updateGameState(gameState);
        updateTeamsDisplay();
    };
}

/**
 * Gère l'affichage et le traitement des cartes PDB (Problèmes divers et besoins)
 */
function handlePDBCard() {
    // Utilise les données des cartes PDB
    const pdbCard = getRandomCard('pdb');
    
    // Affiche le titre de la carte
    document.getElementById('pdb-text').textContent = pdbCard.title;
    
    // Gestion des effets spéciaux ou des montants
    if (pdbCard.type === 'special') {
        // Pour les cartes à effets spéciaux
        let effectText = '';
        
        switch (pdbCard.effect) {
            case 'reduction':
                effectText = `-${pdbCard.value}% sur votre prochaine transaction`;
                break;
            case 'cancel_next':
                effectText = 'Prochaine cession annulée';
                break;
            default:
                effectText = 'Effet spécial';
        }
        
        document.getElementById('pdb-amount').textContent = effectText;
        document.getElementById('pdb-amount').classList.remove('danger-amount');
    } else {
        // Pour les cartes avec un montant
        const amount = pdbCard.amount || getRandomAmount(pdbCard.minAmount, pdbCard.maxAmount);
        const isPositive = amount > 0;
        
        document.getElementById('pdb-amount').textContent = isPositive 
            ? `+${amount} K` 
            : `-${Math.abs(amount)} K`;
            
        if (isPositive) {
            document.getElementById('pdb-amount').classList.remove('danger-amount');
        } else {
            document.getElementById('pdb-amount').classList.add('danger-amount');
        }
    }
    
    // Affiche la description si disponible
    const descriptionElement = document.getElementById('pdb-description');
    if (descriptionElement) {
        descriptionElement.textContent = pdbCard.description || '';
        descriptionElement.style.display = pdbCard.description ? 'block' : 'none';
    }
    
    // Affiche la modale PDB
    toggleModal('pdb-modal', true);
    
    // Quand l'utilisateur clique sur continuer, ferme la modale et applique l'effet
    document.getElementById('pdb-continue').onclick = () => {
        toggleModal('pdb-modal', false);
        
        const gameState = getGameState();
        
        // Applique l'effet selon le type de carte
        if (pdbCard.type === 'special') {
            // Sauvegarde l'effet spécial pour l'équipe active
            // À implémenter : stocker l'effet pour une application future
            const teamState = gameState.teams[gameState.activeTeam];
            if (!teamState.effects) teamState.effects = [];
            
            teamState.effects.push({
                type: pdbCard.effect,
                value: pdbCard.value,
                applied: false
            });
            
            updateGameState(gameState);
        } else {
            // Applique le montant au score
            const amount = pdbCard.amount || getRandomAmount(pdbCard.minAmount, pdbCard.maxAmount);
            updateTeamScore(gameState.activeTeam, -amount);
        }
        
        updateTeamsDisplay();
    };
}
