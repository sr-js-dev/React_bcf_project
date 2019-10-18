import { HistoryInfo } from 'types/global';

class HistoryManager {
    constructor() {
        this._initHistory();
    }

    history: Array<HistoryInfo> = [];

    private _initHistory = () => {
        this.history = [
            {
                id: '0',
                updatedAt: 'Jul 2019',
                updatedBy: 'test4@bc.com',
                createdAt: 'Jun 2019',
                title: 'Internship',
                description: 'I worked here as an internship for 3 years. My main task was to implement simple components',
                from: 'Apr 2008',
                to: 'Aug 2011',
                images: [
                    'https://image.shutterstock.com/z/stock-photo-making-great-decisions-young-beautiful-woman-gesturing-and-discussing-something-with-smile-while-370390046.jpg',
                    'https://assets.rockefellerfoundation.org/app/uploads/20150518134031/Working-on-MacBook-Air-Unsplash-Alejandro-Escamilla.jpg'
                ]
            },
            {
                id: '1',
                updatedAt: 'Apr 2019',
                updatedBy: 'test4@bc.com',
                createdAt: 'Apr 2019',
                title: 'Junior Developer',
                description: 'I worked here as a junior front-end developer for 4 years. My main task was to create pages using html, css, and javascript with other team members.',
                from: 'Sep 2011',
                to: 'Jan 2015',
                images: [
                    'https://static.businessinsider.sg/sites/2/2017/06/583daf7fe02ba75f658b596e.jpg'
                ]
            }
        ];
    }

    private _findNewId = () => {
        let id: number = 0;

        while (true) {
            const strId = id.toString();
            let found: boolean = this.history.some(item => item.id === strId);

            if (!found) break;
            id++;
        }

        return id.toString();
    }

    public getHistory = () => {
        return this.history;
    }

    public addHistory = (info: HistoryInfo) => {
        info.id = this._findNewId();
        this.history.push(info);

        return this.history;
    }

    public deleteHistory = (id: string) => {
        const len = this.history.length;
        for (let i = 0; i < len; i++) {
            if (this.history[i].id === id) {
                this.history.splice(i, 1);
                return this.history;
            }
        }
    }

    public updateHistory = (id: string, info: HistoryInfo) => {
        const len = this.history.length;
        for (let i = 0; i < len; i++) {
            if (this.history[i].id === id) {
                info.id = id;
                this.history.splice(i, 1, info);
                return this.history;
            }
        }
    }
}

export default new HistoryManager();