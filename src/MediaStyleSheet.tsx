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
                const deviceOverride = param.isHandheld() ? styleSheet[key].handheld : styleSheet[key].tablet;
                delete styleSheet[key].handheld;
                delete styleSheet[key].tablet;

                styleSheet[key] = {
                    ...styleSheet[key],
                    ...deviceOverride,
                };
            });
            return StyleSheet.create(styleSheet);
        }
    };
}

function objectKeys<T extends Object>(obj: T) {
    return Object.keys(obj) as Array<keyof T>;
}
