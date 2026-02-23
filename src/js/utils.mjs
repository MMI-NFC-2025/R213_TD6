export function formatDate (date) {
    // Formater la date en français
    console.log(date);
    
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const DateString = new Date(date).toLocaleDateString('fr-FR', options);
    return DateString;
}