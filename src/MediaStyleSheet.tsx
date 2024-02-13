import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from 'react-native';

export type MediaOptions = {
    [mediaKey: string]: () => boolean;
};

export function createMediaStyleSheet(mediaOptions: MediaOptions) {
    type MediaKeys = keyof typeof mediaOptions;

    type MediaViewStyle = ViewStyle & {
        [s in MediaKeys]: ViewStyle;
    };

    type MediaTextStyle = TextStyle & {
        [s in MediaKeys]: TextStyle;
    };

    type MediaImageStyle = ImageStyle & {
        [s in MediaKeys]: ImageStyle;
    };

    type MediaNamedStyles<T> = { [P in keyof T]: MediaViewStyle | MediaTextStyle | MediaImageStyle };
    return class MediaStyleSheet {
        static create<T extends MediaNamedStyles<T> | MediaNamedStyles<any>>(styleSheet: T) {
            objectKeys(styleSheet).forEach(key => {
                let newStyle = { ...styleSheet[key] };
                objectKeys(mediaOptions).forEach(x => {
                    if (mediaOptions[x]()) {
                        newStyle = { ...newStyle, ...styleSheet[key][x] };
                    }
                    delete newStyle[x];
                });

                styleSheet[key] = newStyle;
            });
            return StyleSheet.create(styleSheet);
        }
    };
}

function objectKeys<T extends Object>(obj: T) {
    return Object.keys(obj) as Array<keyof T>;
}
