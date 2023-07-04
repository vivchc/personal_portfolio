// Set color for room objects

// "Dictionary" to track the color of every room object's material
var colorObjectDict = {
    // nearly black (dumbbell handles ONLY)
    '#2E3338': ['dumbbell_handles'],
    // purplish black
    '#454C53': [
        'drawer_handle',
        'lamp_pole',
        'mailbox_stand',
        'books_upright06',
        'books_slanted'
    ],
    // tan
    '#CCBCAC': ['cup_intro', 'cup_intro_inside', 'wall'],
    // medium tan (floor ONLY)
    '#81766E': ['floor'],
    // dark tan
    '#766B65': ['curtain_rod', 'wall_shelf'],
    // blue
    '#3b6597': ['tank', 'drawer_base', 'books_upright03'],
    // dark gray blue
    '#526a75': [
        'laptop_screen',
        'laptop_body',
        'drawer_base_inside',
        'books_upright01'
    ],
    // medium gray blue (steps ONLY)
    '#71888E': ['steps'],
    // light gray blue
    '#768a8c': ['desk_top', 'rug'],
    // green
    '#3c564b': ['chair_seat', 'dumbbell_weights', 'plant_leaves'],
    // yellow
    '#F2A964': [
        'tissue_box',
        'beanbag',
        'lamp_base',
        'lamp_head',
        'mailbox_body',
        'sticky_notes',
        'plant_pot'
    ],
    // dark yellow (lamp_head_inside ONLY)
    '#CF9763': ['lamp_head_inside'],
    // orange
    '#AE643D': ['cup', 'yoga_mat', 'books_down'],
    // red
    '#83221b': [
        'bag_top',
        'ipad_cover',
        'sticky_notes_clips',
        'books_upright04'
    ],
    // rust red
    '#9B4638': ['bag_body', 'mini_table', 'mailbox_flag'],
    // lighter rust red (curtain ONLY)
    '#C45647': ['curtain'],
    // pink
    '#ed6555': ['books_upright02', 'books_upright05']
};

export default function (roomChild) {
    if (roomChild.children.length > 0) {
        roomChild.children.forEach((primary) => {
            if (primary.children.length > 0) {
                // child is a secondary group (eg. desk_legs)
                primary.children.forEach((secondary) => {
                    findObjectColor(secondary);
                });
            } else {
                // roomChild is a primary group (eg. desk)
                findObjectColor(primary);
            }
        });
    } else {
        // roomChild has NO children
        findObjectColor(roomChild);
    }
}

// Sets color for all room objects
function findObjectColor(obj) {
    // See which color object material belongs to
    Object.keys(colorObjectDict).forEach((color) => {
        // Iterates through color hex codes
        if (Object.values(colorObjectDict[color]).includes(obj.material.name)) {
            obj.material.color.set(color);
        }
    });
}
