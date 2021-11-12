/*---------------------------------------------------------------------------------------------------------------------
    Tool per creare un file json di indice a tutte le icone di home automation
---------------------------------------------------------------------------------------------------------------------*/

const fs = require('fs')

/*--------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------*/
function replaceColor(raw, color) {
    raw = raw.replace(/fill="#5d6b82"/g, ``);

    return raw;
}


/*--------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------*/
var scanSvg = function (dir) {
    const icons = fs.readdirSync(dir);


    icons.forEach(function (icon) {
        // Verifichiamo sia un file
        if (fs.statSync(dir + '/' + icon).isFile()) {
            // Verifichiamo si tratti di un icona
            if (icon.split('.')[1] == 'svg') {
                const baseName = icon.split('.')[0];
                //console.log(baseName);
                try {
                    //Apriamo il file di descrizione
                    // if (baseName == '2223') { console.log('aaaaaaaaaaaa'); }

                    //Modifichiamo l'icona
                    const rawicon = fs.readFileSync(dir + '/' + baseName + '.svg', 'utf8');
                    const modicon = replaceColor(rawicon, 'fff');
                    // const modDimIcon = replaceDimension(modicon, { width: '50pt', height: '50pt' });
                    // width="50pt" height="50pt"
                    //La salviamo
                    fs.writeFileSync(`${'../assets/instruments-icons/light'}/${baseName}.svg`, modicon);


                }
                catch (e) {
                    console.log(e);
                }
            }
        }
    });


};

// Apriamo la cartella degli svg
let obj = scanSvg('../assets/instruments-icons/light');

