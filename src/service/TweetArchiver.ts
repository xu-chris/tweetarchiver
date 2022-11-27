import * as dotenv from 'dotenv'
import fs from 'fs'
import { ITweetMediaMetaData, TwitterScraper } from '@tcortega/twitter-scraper'
import https from 'https'
import path from 'path'
import Store from './Store'

export interface TweetArchivedCallback {
    (message: string): void;
}

export class TweetArchiver {
    private _store!: Store
    private _dir!: string
    
    constructor () {
        this.setupArchive();
        this.setupStoreFile();
    }
    
    setupArchive () {
        dotenv.config()
    
        this._dir = <string>process.env.ROOT_PATH + 'archive/'
        if (!fs.existsSync(this._dir)){
            fs.mkdirSync(this._dir, { recursive: true });
            console.log('Created archive folder: ' + this._dir)
        }
    }

    setupStoreFile () {
        this._store = new Store('tweet')
    }
    
    async archiveTweet (url: string, callback?: TweetArchivedCallback) {
        dotenv.config();
    
        // Fetch Twitter data
        try {
            const twtScraper = await TwitterScraper.create();
            const tweetMeta = await twtScraper.getTweetMeta(url);

            if (this._store.get.indexOf(tweetMeta.id) !== -1) {
                console.log('Skipping tweet ' + url + ' since ID of ' + tweetMeta.id + ' exists in the archive.')
                return;
            }

            // Create folder
            const formattedDate: string = new Date(tweetMeta.created_at).toISOString();
            const dir = this._dir + <string>tweetMeta.id + ' - ' + formattedDate
            if (!fs.existsSync(dir)){
                fs.mkdirSync(dir)
            }
        
            // Store metadata
            const filename = 'meta.json'
            fs.writeFileSync(dir + '/' + filename, JSON.stringify(tweetMeta, null, 4));
        
            // Scan for media
            if (tweetMeta.isMedia) {
                const mediaURLs:ITweetMediaMetaData[] = tweetMeta.media_url!

                // Download all images if multiple given

                if (tweetMeta.isImage) {
                    for (let index in mediaURLs) {

                        const fileURL = mediaURLs[index].url;
                        const filename = path.basename(fileURL);
    
                        // Download media
    
                        https.get(fileURL,(res) => {
                            // Store media
                            const path = dir + '/' + filename; 
                            const filePath = fs.createWriteStream(path);
                            res.pipe(filePath);
                            filePath.on('finish',() => {
                                filePath.close();
                                console.log('Download Completed'); 
                            })
                        })
                    }
                } else {
                    // Download only the first file since it has the best bitrate

                    const fileURL = mediaURLs[0].url;
                    const filename = path.basename(fileURL).split('?')[0];

                    // Download media

                    https.get(fileURL,(res) => {
                        // Store media
                        const path = dir + '/' + filename; 
                        const filePath = fs.createWriteStream(path);
                        res.pipe(filePath);
                        filePath.on('finish',() => {
                            filePath.close();
                            console.log('Download Completed'); 
                        })
                    })
                }
            }

            // Store ID
            this._store.add(tweetMeta.id)
            
            callback;
        } catch (error) {
            console.log(error);
        }
    }
}
