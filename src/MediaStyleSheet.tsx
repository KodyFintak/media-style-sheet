import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from 'react-native';

interface MediaViewStyle extends ViewStyle {
    handheld?: ViewStyle;
    tablet?: ViewStyle;
}

interface MediaTextStyle extends TextStyle {
    handheld?: TextStyle;
    tablet?: TextStyle;
}

interface MediaImageStyle extends ImageStyle {
    handheld?: ImageStyle;
    tablet?: ImageStyle;
}

type MediaNamedStyles<T> = { [P in keyof T]: MediaViewStyle | MediaTextStyle | MediaImageStyle };

export function createMediaStyleSheet(param: { isHandheld: () => boolean; isTablet: () => boolean }) {
    return class MediaStyleSheet {
        static create<T extends MediaNamedStyles<T> | MediaNamedStyles<any>>(styleSheet: T) {
            objectKeys(styleSheet).forEach(key => {
                let newStyle = {...styleSheet[key]};
                if (param.isHandheld()) {
                    newStyle = {...newStyle, ...styleSheet[key].handheld};
                }
                if (param.isTablet()) {
                    newStyle = {...newStyle, ...styleSheet[key].tablet};
                }
                delete newStyle.handheld;
                delete newStyle.tablet;

                styleSheet[key] = newStyle;

            });
            return StyleSheet.create(styleSheet);
        }
    };
}

function objectKeys<T extends Object>(obj: T) {
    return Object.keys(obj) as Array<keyof T>;
}
