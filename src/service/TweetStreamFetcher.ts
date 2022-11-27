import Store from './Store'

export class TweetStreamFetcher {
    private _queryStore!: Store
    private _userStore!: Store

    constructor (baseDir: string) {
        this.setupQueryStoreFile(baseDir);
        this.setupUserStoreFile(baseDir);
    }

    setupQueryStoreFile (baseDir: string) {
        this._queryStore = new Store('queries', baseDir)
    }

    setupUserStoreFile (baseDir: string) {
        this._queryStore = new Store('users', baseDir)
    }

    addQueryStream (queryConfig : WatchStreamDTO) {
        this._queryStore.add(queryConfig)
    }

    addUserStream (queryConfig : WatchStreamDTO) {
        this._queryStore.add(queryConfig)
    }
}

export interface WatchStreamDTO {
    url: string
    since: Date
    until: Date
}   