/**
 * Données du jeu de gestion immobilière
 */

// Types de cartes
const CARD_TYPES = {
    PROPERTY: 'property',
    BONUS: 'bonus',
    FACTURE: 'facture',
    INTERACTION: 'interaction',
    BIENS: 'biens',
    PDB: 'pdb'
};

// Propriétés immobilières
const PROPERTIES = [
    { 
        id: 1, 
        name: 'Maison du directeur', 
        description: 'Petite maison de maître', 
        value: 350, 
        type: 'house'
    },
    { 
        id: 2, 
        name: 'Appartement Vue Mer', 
        description: 'Vue imprenable sur l\'océan', 
        value: 280, 
        type: 'apartment'
    },
    { 
        id: 3, 
        name: 'Terrain Constructible', 
        description: 'Prêt pour un nouveau projet', 
        value: 200, 
        type: 'land'
    },
    { 
        id: 4, 
        name: 'Immeuble de Bureaux', 
        description: 'Au centre des affaires', 
        value: 450, 
        type: 'commercial'
    },
    { 
        id: 5, 
        name: 'Villa de Luxe', 
        description: 'Avec piscine et jardin', 
        value: 650, 
        type: 'house'
    },
    { 
        id: 6, 
        name: 'Studio Centre-Ville', 
        description: 'Idéal pour étudiant', 
        value: 150, 
        type: 'apartment'
    }
];

// Génère le plateau de jeu initial (grille 5x4 = 20 cases)
function generateInitialBoard() {
    const board = [];
    const allTypes = [
        CARD_TYPES.PROPERTY,
        CARD_TYPES.BONUS,
        CARD_TYPES.PDB,
        CARD_TYPES.FACTURE,
        CARD_TYPES.INTERACTION,
        CARD_TYPES.BIENS
    ];
    
    // Distribution des types de cartes (comme dans l'image)
    const typeDistribution = {
        [CARD_TYPES.PROPERTY]: 0,   // Sera calculé ensuite
        [CARD_TYPES.BONUS]: 4,      // ~4 cartes bonus (cadeaux)
        [CARD_TYPES.PDB]: 6,        // ~6 cartes PDB (pdb)
        [CARD_TYPES.FACTURE]: 4,    // ~4 cartes facture
        [CARD_TYPES.INTERACTION]: 4, // ~4 cartes interaction
        [CARD_TYPES.BIENS]: 2       // ~2 cartes biens
    };
    
    // Le reste sera des propriétés
    typeDistribution[CARD_TYPES.PROPERTY] = 20 - Object.values(typeDistribution).reduce((a, b) => a + b, 0);
    
    // Crée un tableau avec tous les types selon leur distribution
    let typesToAssign = [];
    Object.entries(typeDistribution).forEach(([type, count]) => {
        for (let i = 0; i < count; i++) {
            typesToAssign.push(type);
        }
    });
    
    // Mélange le tableau des types pour une distribution aléatoire
    typesToAssign = shuffleArray(typesToAssign);
    
    // Crée le plateau avec 20 cellules (5x4)
    for (let i = 0; i < 20; i++) {
        board.push({
            id: i,
            type: typesToAssign[i],
            highlight: false,
            visited: false,
            position: i
        });
    }
    
    return board;
}

// Fonction pour mélanger un tableau
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// État initial du jeu
const INITIAL_GAME_STATE = {
    teams: {
        1: {
            name: 'Équipe 1',
            score: 0,
            players: ['Pierre', 'Francis', 'Delphine'],
            color: 'team1-color',
            active: true,
            position: 0
        },
        2: {
            name: 'Équipe 2',
            score: 0,
            players: ['Paul', 'Ahmad', 'Estelle'],
            color: 'team2-color',
            active: true,
            position: 0
        },
        3: {
            name: 'Équipe 3',
            score: 0,
            players: [],
            color: 'team3-color',
            active: false,
            position: 0
        },
        4: {
            name: 'Équipe 4',
            score: 0,
            players: [],
            color: 'team4-color',
            active: false,
            position: 0
        }
    },
    currentTurn: 1,
    activeTeam: 1,
    activeCard: null,
    dice: 1,
    gameTime: 5 * 60, // 5 minutes en secondes
    timerStarted: false,  // Indique si le timer a été démarré
    gameBoard: generateInitialBoard()
};