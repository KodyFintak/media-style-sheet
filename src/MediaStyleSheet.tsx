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
                styleSheet[key] = this.flattenStyleWithMediaStyles(styleSheet, key);
            });
            return StyleSheet.create(styleSheet);
        }

        private static flattenStyleWithMediaStyles<T extends MediaNamedStyles<T> | MediaNamedStyles<any>>(
            styleSheet: T,
            key: keyof T,
        ) {
            let newStyle = { ...styleSheet[key] };

            Object.keys(mediaOptions).forEach(mediaKey => {
                if (this.hasMediaOption(mediaKey)) {
                    newStyle = { ...newStyle, ...styleSheet[key][mediaKey] };
                }
                delete newStyle[mediaKey];
            });

            return newStyle;
        }

        private static hasMediaOption(mediaKey: string): boolean {
            return mediaOptions[mediaKey]();
        }
    };
}

function objectKeys<T extends Object>(obj: T) {
    return Object.keys(obj) as Array<keyof T>;
}
