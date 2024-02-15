import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from 'react-native';

export type MediaOptions = {
    [key: string]: () => boolean;
};

type UnionToIntersection<U> = (U extends any ? (x: U) => void : never) extends (x: infer I) => void ? I : never;

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
    type FlattenMedia<T> = Omit<T, MediaKeys> & UnionToIntersection<T[MediaKeys]>;
    type StyleSheet<T> = { [K in keyof T]: FlattenMedia<T[K]> };

    return class MediaStyleSheet {
        static create<T extends MediaNamedStyles<T> | MediaNamedStyles<any>>(
            styleSheet: T & MediaNamedStyles<any>,
        ): StyleSheet<T> {
            const finalStyleSheet = {} as StyleSheet<T>;

            Object.keys(styleSheet).forEach(key => {
                const style = styleSheet[key];
                const baseStyle = { ...style };

                Object.keys(mediaOptions).forEach(mediaKey => {
                    delete baseStyle[mediaKey];
                });

                let newStyle = { ...baseStyle };

                Object.keys(mediaOptions).forEach(mediaKey => {
                    if (mediaOptions[mediaKey]()) {
                        const mediaStyle: NamedStyle = style[mediaKey] ?? {};
                        newStyle = { ...newStyle, ...mediaStyle };
                    }
                });

                // @ts-ignore
                finalStyleSheet[key] = newStyle;
            });

            // @ts-ignore
            return StyleSheet.create(finalStyleSheet);
        }
    };
}

export function objectKeys<T extends Object>(obj: T) {
    return Object.keys(obj) as Array<keyof T>;
}
