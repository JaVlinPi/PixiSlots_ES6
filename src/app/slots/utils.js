import {
    VISIBLE_ROWS,
    NUM_OF_ROWS,
    REEL_SYMBOL_DATA,
    WIN_LINES,
    MIN_WIN_LENGTH,
    NUM_OF_REELS,
    SYMBOLS_TYPES
} from "../constants";


export function getSymbolsAtPosition(reel,position,overflow) {
    overflow = overflow == false ? false : true;
    let numOfSymbols = overflow ? VISIBLE_ROWS : NUM_OF_ROWS;
    let reelData = REEL_SYMBOL_DATA[reel];
    let index = Math.floor(position);
    let returnArr = reelData.slice(index,index+numOfSymbols);
    if ( returnArr.length < numOfSymbols ) {
        returnArr = returnArr.concat(reelData.slice(0,numOfSymbols-returnArr.length));
    }
    return returnArr;
}

function convertResultsData(resultsXML) {

    let parser = new DOMParser();
    let xmlDoc = parser.parseFromString(resultsXML,"text/xml");
    var response = xmlDoc.getElementsByTagName('Response')[0];
    var balance = response.getAttribute("balance");
    var win = response.getAttribute("win");
    var SymbolGrids = response.childNodes;
    let symbols = [];
    for ( var i = 0; i < SymbolGrids.length; i++ ) {
        if( SymbolGrids[i].nodeType !== Node.TEXT_NODE ) {
            let index = parseInt(SymbolGrids[i].getAttribute("column_id"));
            let reelSymbols = SymbolGrids[i].getAttribute("symbols").split(',');
            for ( var n = 0; n < reelSymbols.length; n++ ) {
                reelSymbols[n] = SYMBOLS_TYPES[parseInt(reelSymbols[n])]
            }
            symbols[index] = reelSymbols;
        }
    }

    let wins = getWins(symbols);
    return {
        wins: wins,
        winAmount: win,
        symbols: symbols,
    };
}

export function getResult(callback) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.responseText && this.readyState == 4 && this.status == 200) {
            callback(convertResultsData(this.responseText));
        }
    };
    xhttp.open("POST", "http://localhost:8888/serve", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send('<Request balance="100.00" stake="1.20" />');
}

export function getWins(symbols) {
    let wins = [];
    for ( var i = 0; i < WIN_LINES.length; i++ ) {
        let startSymbol = symbols[0][WIN_LINES[i][0]];
        for ( var n = 1; n < WIN_LINES[i].length; n++ ) {
            if ( startSymbol != 'wild' && symbols[n][WIN_LINES[i][n]] != startSymbol && symbols[n][WIN_LINES[i][n]] != 'wild' ) {
                break;
            }
            if ( startSymbol == 'wild' && symbols[n][WIN_LINES[i][n]] != 'wild' ) {
                startSymbol = symbols[n][WIN_LINES[i][n]];
            }
        }
        if ( n >= MIN_WIN_LENGTH ) {
            wins.push({
                lineId: i,
                length: Math.min(n,WIN_LINES[i].length),
            });
        }
    }
    return wins;
}

