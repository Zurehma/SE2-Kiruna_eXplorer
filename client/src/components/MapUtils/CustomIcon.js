// Icon mapping based on document type
const iconMap = {
    Design: 'bi-file-earmark-text',
    Informative: 'bi-info-circle',
    Prescriptive: 'bi-arrow-right-square',
    Technical: 'bi-file-earmark-code',
    Agreement: 'bi-people-fill',
    Conflict: 'bi-x-circle',
    Consultation: 'bi-chat-dots',
    Action: 'bi-exclamation-triangle',
    Material: 'bi-file-earmark-binary',
};

// Function to create a custom divIcon with a specific icon inside
const createCustomIcon = (type, selected) => {
    const iconClass = iconMap[type] || 'bi-file-earmark';
    const backgroundColor = selected ? 'yellow' : 'white'; // Cambia il colore di sfondo

    return L.divIcon({
        html: `
            <div style="display: flex; align-items: center; justify-content: center; background: ${backgroundColor}; 
                width: 25px; height: 25px; border-radius: 50%; border: 2px solid black;">
                <i class="bi ${iconClass}" style="color: black; font-size: 12px;"></i>
            </div>`,
        className: '' // Clear default class
    });
};

export { createCustomIcon, iconMap };