import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from 'react-native';

export type MediaOptions = {
    [key: string]: () => boolean;
};

type NamedStyle = ViewStyle | TextStyle | ImageStyle;

export function createMediaStyleSheet<MediaTypes extends MediaOptions>(mediaOptions: MediaTypes) {
    type MediaKeys = keyof MediaTypes;
    type MediaKeyStyle<T> = { [s in MediaKeys]?: T };

    type MediaViewStyle = ViewStyle & MediaKeyStyle<ViewStyle>;
    type MediaTextStyle = TextStyle & MediaKeyStyle<TextStyle>;
    type MediaImageStyle = ImageStyle & MediaKeyStyle<ImageStyle>;

    type MediaNamedStyle = MediaViewStyle | MediaTextStyle | MediaImageStyle;
    type MediaNamedStyles<T> = { [P in keyof T]: MediaNamedStyle };

    // @ts-ignore
    type FlattenMedia<T> = Omit<T, MediaKeys> & T[MediaKeys];
    type StyleSheet<T> = { [K in keyof T]: FlattenMedia<T[K]> };

    return class MediaStyleSheet {
        static create<T extends MediaNamedStyles<T> | MediaNamedStyles<any>>(
            styleSheet: T & MediaNamedStyles<any>,
        ): StyleSheet<T> {
            const finalStyleSheet = {} as StyleSheet<T>;

            Object.keys(styleSheet).forEach(key => {
                const style = styleSheet[key];
                let newStyle = this.extractBaseStyle(style);

                Object.keys(mediaOptions)
                    .filter(mediaKey => mediaOptions[mediaKey]())
                    .forEach(mediaKey => {
                        const mediaStyle: NamedStyle = style[mediaKey] ?? {};
                        newStyle = { ...newStyle, ...mediaStyle };
                    });

                // @ts-ignore
                finalStyleSheet[key] = newStyle;
            });

            // @ts-ignore
            return StyleSheet.create(finalStyleSheet);
        }

        private static extractBaseStyle<T>(style: (T & MediaNamedStyles<any>)[string]) {
            const baseStyle = { ...style };

            Object.keys(mediaOptions).forEach(mediaKey => {
                delete baseStyle[mediaKey];
            });

            return baseStyle;
        }
    };
}
