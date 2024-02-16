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

    function flattenMediaStyle<T>(style: (T & MediaNamedStyles<any>)[string]) {
        const baseStyle = extractBaseStyle(style);

        return Object.keys(mediaOptions)
            .filter(mediaKey => mediaOptions[mediaKey]())
            .reduce((finalStyle, mediaKey) => {
                const mediaStyle: NamedStyle = style[mediaKey] ?? {};
                return { ...finalStyle, ...mediaStyle };
            }, baseStyle);
    }

    function extractBaseStyle<T>(style: (T & MediaNamedStyles<any>)[string]): NamedStyle {
        const baseStyle = { ...style };
        Object.keys(mediaOptions).forEach(mediaKey => delete baseStyle[mediaKey]);
        return baseStyle;
    }

    return class MediaStyleSheet {
        static create<T extends MediaNamedStyles<T> | MediaNamedStyles<any>>(
            styleSheet: T & MediaNamedStyles<any>,
        ): StyleSheet<T> {
            const finalStyleSheet = {} as StyleSheet<T>;

            Object.keys(styleSheet).forEach(key => {
                const style = styleSheet[key];
                // @ts-ignore
                finalStyleSheet[key] = flattenMediaStyle(style);
            });

            // @ts-ignore
            return StyleSheet.create(finalStyleSheet);
        }
    };
}
