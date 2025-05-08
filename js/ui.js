/**
 * Gestion de l'interface utilisateur
 */

// Fonctions pour manipuler les écrans
function showScreen(screenId) {
    // Cache tous les écrans
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active-screen');
    });
    
    // Affiche l'écran demandé
    const screen = document.getElementById(screenId);
    if (screen) {
        screen.classList.add('active-screen');
    }
}

// Affiche ou cache les modalités
function toggleModal(modalId, show) {
    const modal = document.getElementById(modalId);
    if (modal) {
        if (show) {
            modal.classList.add('show');
        } else {
            modal.classList.remove('show');
        }
    }
}

// Met à jour l'affichage des équipes et des scores
function updateTeamsDisplay() {
    const gameState = getGameState();
    
    // Met à jour les informations du tour
    document.getElementById('turn-counter').textContent = gameState.currentTurn;
    document.getElementById('active-team-name').textContent = gameState.teams[gameState.activeTeam].name;
    
    // Met à jour les blocs de score
    Object.keys(gameState.teams).forEach(teamId => {
        const team = gameState.teams[teamId];
        if (!team.active) return;
        
        const scoreBlock = document.getElementById(`team${teamId}-score-block`);
        if (scoreBlock) {
            const scoreElement = scoreBlock.querySelector('.score');
            
            // Affiche '+' pour les scores positifs, '-' pour les négatifs
            const scorePrefix = team.score >= 0 ? '' : '-';
            const scoreAbsValue = Math.abs(team.score);
            
            if (scoreElement) {
                scoreElement.textContent = `${scorePrefix}${scoreAbsValue} K`;
            }
            
            // Mise à jour du nom de l'équipe
            const teamNameDiv = scoreBlock.querySelector('div:first-child');
            if (teamNameDiv) {
                teamNameDiv.textContent = team.name;
            }
        }
    });
    
    // Met à jour les informations du joueur actif
    updateCurrentPlayerInfo();
}

// Crée dynamiquement le plateau de jeu
function renderGameBoard() {
    const gameState = getGameState();
    const boardElement = document.querySelector('.game-board');
    
    if (!boardElement) return;
    
    // Vide le plateau
    boardElement.innerHTML = '';
    
    // Crée les cellules
    gameState.gameBoard.forEach(cell => {
        const cellElement = document.createElement('div');
        cellElement.className = `board-cell ${cell.type}`;
        cellElement.dataset.id = cell.id;
        cellElement.dataset.type = cell.type;
        
        // Ajoute un effet de surbrillance pour la case où se trouve le joueur actif
        Object.keys(gameState.teams).forEach(teamId => {
            const team = gameState.teams[teamId];
            if (team.active && team.position === cell.id) {
                cellElement.classList.add('active-player');
                cellElement.setAttribute('data-team', teamId);
                
                // Ajoute un indicateur de joueur
                const playerIndicator = document.createElement('div');
                playerIndicator.className = `player-indicator ${team.color}`;
                cellElement.appendChild(playerIndicator);
            }
        });
        
        // Ajoute l'icône appropriée selon le type de cellule
        const iconElement = document.createElement('div');
        iconElement.className = 'cell-icon';
        
        let iconSvg = '';
        
        switch (cell.type) {
            case CARD_TYPES.PROPERTY:
                iconSvg = '<svg viewBox="0 0 24 24"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"></path></svg>';
                break;
            case CARD_TYPES.BONUS:
                iconSvg = '<svg viewBox="0 0 24 24"><path d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"></path></svg>';
                break;
            case CARD_TYPES.PDB:
                iconSvg = '<svg viewBox="0 0 24 24"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"></path></svg>';
                break;
            case CARD_TYPES.FACTURE:
                iconSvg = '<svg viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"></path></svg>';
                break;
            case CARD_TYPES.INTERACTION:
                iconSvg = '<svg viewBox="0 0 24 24"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"></path></svg>';
                break;
            case CARD_TYPES.BIENS:
                iconSvg = '<svg viewBox="0 0 24 24"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"></path></svg>';
                break;
        }
        
        iconElement.innerHTML = iconSvg;
        cellElement.appendChild(iconElement);
        
        // Ajoute un gestionnaire d'événements pour le clic sur la cellule
        cellElement.addEventListener('click', () => handleCellClick(cell.id, cell.type));
        
        boardElement.appendChild(cellElement);
    });
}

// Met à jour l'affichage du dé
function updateDiceDisplay(value) {
    // Met à jour le dé normal
    const diceElement = document.getElementById('dice');
    
    if (diceElement) {
        diceElement.dataset.value = value;
        
        // Mettre à jour l'apparence du dé
        const faceElement = document.getElementById('dice-face');
        if (faceElement) {
            // Supprimer tous les points existants
            const dots = faceElement.querySelectorAll('.dot');
            dots.forEach(dot => {
                if (!dot.classList.contains('center')) {
                    dot.remove();
                }
            });
            
            // Afficher le centre uniquement pour le 1
            const centerDot = faceElement.querySelector('.center');
            if (centerDot) {
                centerDot.style.display = value === 1 ? 'block' : 'none';
            }
            
            // Ajouter les points selon la valeur
            switch (value) {
                case 2:
                    addDot(faceElement, 'top-left');
                    addDot(faceElement, 'bottom-right');
                    break;
                case 3:
                    addDot(faceElement, 'top-left');
                    addDot(faceElement, 'center');
                    addDot(faceElement, 'bottom-right');
                    break;
                case 4:
                    addDot(faceElement, 'top-left');
                    addDot(faceElement, 'top-right');
                    addDot(faceElement, 'bottom-left');
                    addDot(faceElement, 'bottom-right');
                    break;
                case 5:
                    addDot(faceElement, 'top-left');
                    addDot(faceElement, 'top-right');
                    addDot(faceElement, 'center');
                    addDot(faceElement, 'bottom-left');
                    addDot(faceElement, 'bottom-right');
                    break;
                case 6:
                    addDot(faceElement, 'top-left');
                    addDot(faceElement, 'top-right');
                    addDot(faceElement, 'middle-left');
                    addDot(faceElement, 'middle-right');
                    addDot(faceElement, 'bottom-left');
                    addDot(faceElement, 'bottom-right');
                    break;
            }
        }
    }
    
    // Met également à jour le dé en plein écran
    updateFullscreenDice(value);
}

// Met à jour l'affichage du dé en plein écran
function updateFullscreenDice(value) {
    const fullscreenDice = document.getElementById('fullscreen-dice');
    
    if (fullscreenDice) {
        fullscreenDice.setAttribute('data-value', value);
        
        // Mettre à jour l'apparence du dé en plein écran
        const fullscreenFace = fullscreenDice.querySelector('.dice-face');
        if (fullscreenFace) {
            // Supprimer d'abord tous les points existants
            fullscreenFace.innerHTML = '';
            
            // Ajouter les points selon la valeur du dé
            switch (parseInt(value)) {
                case 1:
                    // Seulement un point central
                    const centerDot = document.createElement('div');
                    centerDot.className = 'dot center';
                    fullscreenFace.appendChild(centerDot);
                    break;
                    
                case 2:
                    // Points en haut à gauche et en bas à droite
                    const topLeft2 = document.createElement('div');
                    topLeft2.className = 'dot top-left';
                    fullscreenFace.appendChild(topLeft2);
                    
                    const bottomRight2 = document.createElement('div');
                    bottomRight2.className = 'dot bottom-right';
                    fullscreenFace.appendChild(bottomRight2);
                    break;
                    
                case 3:
                    // Points en haut à gauche, au centre et en bas à droite
                    const topLeft3 = document.createElement('div');
                    topLeft3.className = 'dot top-left';
                    fullscreenFace.appendChild(topLeft3);
                    
                    const center3 = document.createElement('div');
                    center3.className = 'dot center';
                    fullscreenFace.appendChild(center3);
                    
                    const bottomRight3 = document.createElement('div');
                    bottomRight3.className = 'dot bottom-right';
                    fullscreenFace.appendChild(bottomRight3);
                    break;
                    
                case 4:
                    // Points aux quatre coins
                    const topLeft4 = document.createElement('div');
                    topLeft4.className = 'dot top-left';
                    fullscreenFace.appendChild(topLeft4);
                    
                    const topRight4 = document.createElement('div');
                    topRight4.className = 'dot top-right';
                    fullscreenFace.appendChild(topRight4);
                    
                    const bottomLeft4 = document.createElement('div');
                    bottomLeft4.className = 'dot bottom-left';
                    fullscreenFace.appendChild(bottomLeft4);
                    
                    const bottomRight4 = document.createElement('div');
                    bottomRight4.className = 'dot bottom-right';
                    fullscreenFace.appendChild(bottomRight4);
                    break;
                    
                case 5:
                    // Points aux quatre coins + centre
                    const topLeft5 = document.createElement('div');
                    topLeft5.className = 'dot top-left';
                    fullscreenFace.appendChild(topLeft5);
                    
                    const topRight5 = document.createElement('div');
                    topRight5.className = 'dot top-right';
                    fullscreenFace.appendChild(topRight5);
                    
                    const center5 = document.createElement('div');
                    center5.className = 'dot center';
                    fullscreenFace.appendChild(center5);
                    
                    const bottomLeft5 = document.createElement('div');
                    bottomLeft5.className = 'dot bottom-left';
                    fullscreenFace.appendChild(bottomLeft5);
                    
                    const bottomRight5 = document.createElement('div');
                    bottomRight5.className = 'dot bottom-right';
                    fullscreenFace.appendChild(bottomRight5);
                    break;
                    
                case 6:
                    // 6 points (3 de chaque côté)
                    const topLeft6 = document.createElement('div');
                    topLeft6.className = 'dot top-left';
                    fullscreenFace.appendChild(topLeft6);
                    
                    const topRight6 = document.createElement('div');
                    topRight6.className = 'dot top-right';
                    fullscreenFace.appendChild(topRight6);
                    
                    const middleLeft6 = document.createElement('div');
                    middleLeft6.className = 'dot middle-left';
                    fullscreenFace.appendChild(middleLeft6);
                    
                    const middleRight6 = document.createElement('div');
                    middleRight6.className = 'dot middle-right';
                    fullscreenFace.appendChild(middleRight6);
                    
                    const bottomLeft6 = document.createElement('div');
                    bottomLeft6.className = 'dot bottom-left';
                    fullscreenFace.appendChild(bottomLeft6);
                    
                    const bottomRight6 = document.createElement('div');
                    bottomRight6.className = 'dot bottom-right';
                    fullscreenFace.appendChild(bottomRight6);
                    break;
            }
        }
    }
}

// Ajoute un point au dé
function addDot(faceElement, position) {
    const dot = document.createElement('div');
    dot.className = `dot ${position}`;
    
    // Positionnement des points selon leur position
    switch (position) {
        case 'top-left':
            dot.style.gridArea = '1 / 1';
            break;
        case 'top-right':
            dot.style.gridArea = '1 / 3';
            break;
        case 'middle-left':
            dot.style.gridArea = '2 / 1';
            break;
        case 'center':
            dot.style.gridArea = '2 / 2';
            break;
        case 'middle-right':
            dot.style.gridArea = '2 / 3';
            break;
        case 'bottom-left':
            dot.style.gridArea = '3 / 1';
            break;
        case 'bottom-right':
            dot.style.gridArea = '3 / 3';
            break;
    }
    
    faceElement.appendChild(dot);
}

// Affiche la modalité de propriété
function showPropertyModal(property) {
    document.getElementById('property-name').textContent = property.name;
    document.getElementById('property-description').textContent = property.description;
    document.getElementById('property-value-amount').textContent = `${property.value} K`;
    
    toggleModal('property-modal', true);
}

// Affiche la modalité vidéo
function showVideoModal(duration = '00:15') {
    document.getElementById('video-duration').textContent = duration;
    document.getElementById('progress-bar').style.width = '0%';
    
    toggleModal('video-modal', true);
    
    // Simuler la progression de la vidéo
    const totalDurationInSeconds = duration.split(':').reduce((acc, time) => (60 * acc) + parseInt(time), 0);
    const interval = 100; // Mise à jour toutes les 100ms
    const incrementPerInterval = 100 / (totalDurationInSeconds * 10); // 10 intervalles par seconde
    
    let progress = 0;
    const progressBar = document.getElementById('progress-bar');
    
    const timer = setInterval(() => {
        progress += incrementPerInterval;
        if (progress >= 100) {
            clearInterval(timer);
            progress = 100;
            // Ferme automatiquement après la fin de la vidéo
            setTimeout(() => toggleModal('video-modal', false), 500);
        }
        progressBar.style.width = `${progress}%`;
    }, interval);
    
    // Stocke le timer pour pouvoir l'annuler si nécessaire
    window.videoTimer = timer;
}

// Affiche la modalité de victoire
function showWinModal(score, teamName = null) {
    // Met à jour le score final
    document.getElementById('final-score').textContent = `${score} K`;
    
    // Si un nom d'équipe est fourni, afficher qui a gagné
    const winTitle = document.querySelector('#win-modal h3');
    if (teamName && winTitle) {
        winTitle.textContent = `Félicitations ${teamName} !`;
    } else {
        // Trouve l'équipe gagnante à partir du score
        const gameState = getGameState();
        const winningTeams = Object.values(gameState.teams)
            .filter(team => team.active && team.score === score);
        
        if (winningTeams.length > 0 && winTitle) {
            winTitle.textContent = `Félicitations ${winningTeams[0].name} !`;
        }
    }
    
    // Ajoute un effet d'animation de confettis ou de célébration
    document.body.classList.add('win-celebration');
    
    // Joue un son de victoire si disponible
    const winSound = new Audio('assets/win.wav');
    winSound.volume = 0.5;
    winSound.play().catch(e => console.log('Pas de son disponible'));
    
    // Affiche la modale
    toggleModal('win-modal', true);
    
    // Arrête le timer de jeu s'il est en cours
    if (window.gameTimerInterval) {
        clearInterval(window.gameTimerInterval);
    }
}

// Affiche la modalité de sortie
function showExitModal() {
    toggleModal('exit-modal', true);
}

// Met à jour la liste des joueurs
function updatePlayerList() {
    const gameState = getGameState();
    const activeTeam = gameState.teams[gameState.activeTeam];
    const playerListElement = document.getElementById('player-list');

    if (!playerListElement || !activeTeam) return;

    // Clear the current list
    playerListElement.innerHTML = '';

    // Add players of the active team
    activeTeam.players.forEach((player, index) => {
        const playerElement = document.createElement('div');
        playerElement.className = 'player';
        playerElement.textContent = player;

        // Highlight the current player
        if (index === activeTeam.currentPlayer) {
            playerElement.classList.add('current-player');
        }

        playerListElement.appendChild(playerElement);
    });
}

function updateTeamsCorners() {
    const gameState = getGameState();
    const corners = [
        { id: 1, el: document.getElementById('team1-corner') },
        { id: 2, el: document.getElementById('team2-corner') },
        { id: 3, el: document.getElementById('team3-corner') },
        { id: 4, el: document.getElementById('team4-corner') },
    ];
    corners.forEach(({id, el}) => {
        if (!el) return;
        const team = gameState.teams[id];
        if (team && team.active && team.players.length > 0) {
            el.innerHTML = `<span class="team-name">${team.name}</span>` +
                team.players.map((p, idx) => `<div class="player">${p}</div>`).join('');
            el.style.display = '';
        } else {
            el.innerHTML = '';
            el.style.display = 'none';
        }
    });
}

function updateCurrentPlayerInfo() {
    const gameState = getGameState();
    const activeTeam = gameState.teams[gameState.activeTeam];
    const currentPlayerContainer = document.querySelector('#current-player-info .player-list-content');
    
    if (!currentPlayerContainer || !activeTeam) return;
    
    // Effacer le contenu actuel
    currentPlayerContainer.innerHTML = '';
    
    if (activeTeam.players.length > 0) {
        const currentPlayerIdx = activeTeam.currentPlayer;
        const playerName = activeTeam.players[currentPlayerIdx];
        
        // Créer un élément stylisé pour le joueur actif
        const playerElement = document.createElement('div');
        playerElement.className = 'active-player-highlight';
        playerElement.style.borderColor = `var(--team${gameState.activeTeam}-color)`;
        playerElement.innerHTML = `<span>Joueur actif: <strong>${playerName}</strong> (${activeTeam.name})</span>`;
        
        currentPlayerContainer.appendChild(playerElement);
    }
}

function updateTeamPanels() {
    const gameState = getGameState();
    const panels = [
        { id: 1, el: document.getElementById('team1-panel') },
        { id: 2, el: document.getElementById('team2-panel') },
        { id: 3, el: document.getElementById('team3-panel') },
        { id: 4, el: document.getElementById('team4-panel') },
    ];
    
    panels.forEach(({id, el}) => {
        if (!el) return;
        const team = gameState.teams[id];
        
        if (team && team.active && team.players.length > 0) {
            // Déterminer si cette équipe est l'équipe active
            const isActiveTeam = (id === gameState.activeTeam);
            
            // Créer le contenu HTML avec des styles appropriés
            let html = `<div class="team-name" style="color:var(--team${id}-color)">${team.name}</div>`;
            
            // Afficher les joueurs de l'équipe
            team.players.forEach((player, idx) => {
                // Déterminer si ce joueur est le joueur actif
                const isActivePlayer = isActiveTeam && (idx === team.currentPlayer);
                
                // Utiliser une classe spéciale pour le joueur actif
                const playerClass = isActivePlayer ? 'player current-player' : 'player';
                const playerStyle = isActivePlayer ? `style="color: var(--accent-color); font-weight: bold;"` : '';
                
                html += `<div class="${playerClass}" ${playerStyle}>${player}</div>`;
            });
            
            el.innerHTML = html;
            el.style.display = 'flex';
            
            // Mettre en évidence le panneau de l'équipe active
            if (isActiveTeam) {
                el.classList.add('active-panel');
            } else {
                el.classList.remove('active-panel');
            }
            
        } else {
            // Masquer le panneau si l'équipe n'est pas active
            el.style.display = 'none';
        }
    });
}
