# TD 1

**Objectif**: Au cours des TDs, nous allons développer un site web pour un conservatoire tout en pratiquant Astro.

1. Commencez par l'installation : [Guide d'installation Astro](https://docs.astro.build/fr/install-and-setup/)

2. Installez Tailwind avec la commande : 
    ```sh
    npx astro add tailwind
    ```

3. Installez l'adaptateur Netlify pour que le site puisse être déployé sur Netlify avec la commande (https://docs.astro.build/fr/guides/integrations-guide/netlify/):
    ```sh
    npx astro add netlify
    ```

4. Supprimez tous les fichiers `.astro` sauf `index.astro`.

5. Créez un nouveau layout contenant un composant header et footer, ainsi qu'un contenu entre les deux.

6. Passez le titre de la page en tant que props au layout.

7. Créez un menu dans le header et un message dans le footer.

# TD 2

**Objectif**: L'objectif de ce TD est d'afficher une liste de données, dans notre site ce sera la liste des événements dans l'agenda du conservatoire :

1. Créez la page `pages/agenda.astro`.

2. Ajoutez la page dans le menu de navigation dans `components/Header.astro`.

3. Ajoutez la liste des événements suivante dans le frontmatter de `agenda.astro` :
```js
const events = [
    {
        title: "Conférence sur les astres",
        date: "Lundi 12 Juillet",
        favori: true,
    },
    {
        title: "Atelier sur les étoiles",
        date: "Mardi 13 Juillet",
        favori: false,
    },
];
```

4. Affichez la liste des événements en utilisant la fonction `events.map` dans des composants Card.
```js
{
    events.map((event) => (
        <ul>
            <li>{event.title} - {event.date}</li>
        </ul>
    ))
}
```
   
5.  Créez le composant `EventCard.astro`.

```js
---
const { event } = Astro.props;
---

<div
    class="border border-gray-200 rounded-lg p-6 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer"
>
    <div class="flex items-center gap-2 mb-2">
        <strong class="text-lg">{event.title}</strong>
    </div>
    <p class="text-gray-600 text-sm mb-4">{event.date}</p>
    <button class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm transition-colors">
        Favori
    </button>
</div>
```
6. Changez la couleur de fond de la carte selon que l’événement est favori ou non, en utilisant les classes Tailwind.

```html
<div class={`event-card border border-gray-200 rounded-lg p-6 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer ${event.favori ? 'bg-yellow-100' : 'bg-white'}`}>
```
   
7. En utilisant un script `JavaScript`, changez la couleur de fond de la carte selon que l’événement soit favori ou non.
```js
<div
    class="event-card border border-gray-200 rounded-lg p-6 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer"
    data-favori={event.favori}
>
    <div class="flex items-center gap-2 mb-2">
        <strong class="text-lg">{event.title}</strong>
    </div>
    <p class="text-gray-600 text-sm mb-4">{event.date}</p>
    <button class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm transition-colors">
        Favori
    </button>
</div>


<script>
    //@ts-nocheck
    const cards = document.querySelectorAll('.event-card');
    cards.forEach((card) => {
        card.addEventListener('click', () => {
            const isFavori = card.dataset.favori === 'true';
            card.dataset.favori = isFavori ? 'false' : 'true';
            console.log(card.dataset.favori);
            card.classList.toggle('bg-yellow-100');
            card.classList.toggle('bg-white');
        });
    });
    
</script>

```

# TD 3

**Objectifs**:
- Afficher une liste de données dynamiques provenant d'une base de données.
- Formater une date en JavaScript.
- Utiliser des modules JavaScript.

1. Installez le paquet `pocketbase` pour pouvoir se connecter à la base de données et utiliser l'API PocketBase en exécutant la commande : `npm install pocketbase`.
2. Créez le fichier `backend.mjs` dans le dossier `src/js`. Ce fichier est un module JavaScript qui gère les communications avec PocketBase.
3. Comme vu dans le module R214, créez une instance de `PocketBase` :
    ```js
    import PocketBase from "pocketbase";
    const pb = new PocketBase("http://127.0.0.1:8090");
    ```

    > La constante `pb` contient une instance de la classe `PocketBase`. Elle peut maintenant être utilisée pour interagir avec le serveur PocketBase et effectuer des opérations CRUD (Create, Read, Update, Delete).

4. Écrivez la fonction vue dans le module R214 pour récupérer la liste des événements dans `backend.mjs`:
```js
export async function getEvents() {
    const today = new Date().toISOString();
    let events = await pb.collection("events").getFullList(
        {
            sort: "-date",
            order: "desc",
            filter: `date >= "${today}"`,
        }
    );
    return events;
}
```

5. Pour formater la date, utilisez la classe `Date` en JavaScript. Par exemple :
```js
const eventDate = new Date(event.date);
const formattedDate = eventDate.toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
});
event.formattedDate = formattedDate;
```

6. Affichez la liste des événements provenant de `PocketBase` au lieu de la liste statique utilisée au TD précédent.
<!-- 5. Afin de récupérer les images, PocketBase utilise un système de stockage de fichiers. Vous pouvez accéder aux images en utilisant l'URL sauvegardée dans la collection avec la fonction `pb.files.getURL(record, url)`. -->
<!-- 6. Pour chaque élément dans la liste récupérée d'événements, ajoutez une propriété contenant l'URL de l'image :
```js
events.forEach((event) => {
    event.img = pb.files.getURL(event, event.imgUrl);
});
``` -->

7. Afin de récupérer les images, PocketBase utilise un système de stockage de fichiers. Vous pouvez accéder aux images en utilisant l'URL sauvegardée dans la collection avec la fonction `pb.files.getURL(record, url)`. Dans le fichier backend ajouter la fonction suivante qui récupère l'url de vos images depuis pocketbase:

```js
export async function getImageUrl(record, imageField) {
    return pb.files.getURL(record, record[imageField]);
}
```

8. Créez le composant `PbImage.astro` pour afficher les image. Il utilise la fonction `getImageURL` définie dans `backend.mjs`:
```js
---
import { getImageUrl } from '../js/backend.mjs';
import { Image } from "astro:assets";

const { record, imageField } = Astro.props;

const imageURL = await getImageUrl(record, imageField);
---

{imageURL && 
    <Image
        src={imageURL}
        alt={record.nomMaison || 'Image'}
        inferSize={true}
    />
}

```

9. Affichez les images en utilisant le composant `PbImage` dans le composant `EventCard`.
