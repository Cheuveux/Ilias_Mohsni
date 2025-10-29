const photoGroups = document.querySelectorAll(".photo-section > div");

photoGroups.forEach((group, groupIndex) => {
    const albums = group.querySelectorAll('.photo-album');

    albums.forEach((album,albumIndex) => {
        album.addEventListener("mouseenter", () => {

            //L'autre album du memengroupe
            albums.forEach((otherAlbum, i) => {
                if(i !== albumIndex){
                    otherAlbum.style.opacity = '0';
                }
            });

            //Les autres photo du groupe précédent si il existe 
            if (groupIndex > 0) {
                const prevGroup = photoGroups[groupIndex - 1];
                const prevAlbums = prevGroup.querySelectorAll('.photo-album');
    
                prevAlbums.forEach(prevAlbum => {

                    prevAlbum.style.opacity = '0';
                    
                });
            }
                if(groupIndex < photoGroups.length - 1) {
                    const nextGroup = photoGroups[groupIndex + 1];
                    const nextAlbums = nextGroup.querySelectorAll('.photo-album');

                    nextAlbums.forEach(nextAlbum => {

                        nextAlbum.style.opacity = '0';
                        
                    });  
                }
            
        });
        album.addEventListener("mouseleave", () => {

            photoGroups.forEach(g => {
                g.querySelectorAll('.photo-album').forEach (a => {
                    a.style.filter = 'none';
                    a.style.opacity = '1';
                });
            });
        });
    });
});