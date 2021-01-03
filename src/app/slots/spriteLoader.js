import * as PIXI from 'pixi.js';
import {
    HIGH_QUALITY_SPRITE_PATH,
    LOW_QUALITY_SPRITE_PATH,
    QUALITY_OPTIONS
} from '../constants';
import CustomSprite from './customSprite';

export default class SpriteLoader {

    loadSprites(list,quality) {
        return new Promise((resolve,reject)=>{

            this.list = list;
            quality = quality || 'high';

            CustomSprite.setQuality(quality);
    
            let path = quality == 'low' ? LOW_QUALITY_SPRITE_PATH : HIGH_QUALITY_SPRITE_PATH;
            for ( let a in list ) {
                PIXI.Loader.shared.add(a+'_'+quality, path+list[a]);
            }
            PIXI.Loader.shared.load(resolve);
        });
    }

    switchQuality(quality) {
        
        return new Promise((resolve,reject)=>{

            if ( QUALITY_OPTIONS.indexOf(quality) == -1 ) {
                console.error('"'+quality+'" is not an available quality type: ['+QUALITY_OPTIONS+']');
                reject();
                return;
            }

            if ( quality == CustomSprite.quality() ) {
                resolve();
                return;
            }

            let path = quality == 'low' ? LOW_QUALITY_SPRITE_PATH : HIGH_QUALITY_SPRITE_PATH;
            for ( let a in this.list ) {
                if ( resources[a+'_'+quality] == undefined ) {
                    PIXI.Loader.shared.add(a+'_'+quality, path+this.list[a]);
                }
            }
            PIXI.Loader.shared.load(()=>{
                CustomSprite.setQuality(quality);
                resolve()
            });
        });
    }

    
}