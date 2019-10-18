import { ProjectLevel } from 'types/project';

export const initLevels: ProjectLevel[] = [
    {
        id: '0',
        number: 0,
        name: 'Level 1',
        description: 'Largest and expensive rooms',
        rooms: [
            {
                id: '0',
                number: 0,
                name: 'My Room',
                type: 'Bed Room',
                description: 'the room with ambiguent light',
                w: 7.2,
                h: 3.4,
                l: 9.6
            },
            {
                id: '1',
                number: 1,
                name: 'Your Room',
                type: 'Living Room',
                description: 'the room with sunlight',
                w: 9.2,
                h: 3.2,
                l: 10.6
            },
            {
                id: '2',
                number: 2,
                name: 'Long Hall',
                type: 'Hallway',
                description: 'the room with ambiguent light',
                w: 2.2,
                h: 3.4,
                l: 8.8
            },
        ]
    },
    {
        id: '1',
        number: 1,
        name: 'Level 2',
        description: 'Middle Rooms',
        rooms: [
            {
                id: '0',
                number: 0,
                name: 'Inexpensive Room',
                type: 'Bath Room',
                description: 'Hot / Cool water',
                w: 8.4,
                h: 3.2,
                l: 6.3
            },
            {
                id: '1',
                number: 1,
                name: 'Expensive Room',
                type: 'Living Room',
                description: 'Inexpensive Room',
                w: 10.2,
                h: 3.8,
                l: 6.6
            },
        ]
    }
];
