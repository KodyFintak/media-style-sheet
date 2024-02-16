# media-style-sheet

Media Query Extension to React-Native StyleSheets

This is a drop and replace for `StyleSheet.create` that

## Install

### yarn

```shell
yarn add media-style-sheet
```

### npm

```shell
npm install media-style-sheet
```

## Usage

First create your MediaStyleSheet using `createMediaStyleSheet` providing your own mediaQuery types and functions.

This example uses a `tablet` and `mobile` media query

```typescript jsx
import { createMediaStyleSheet } from 'media-style-sheet';
import { isTablet, isMobile } from './device';

export const MediaStyleSheet = createMediaStyleSheet({
    tablet: () => isTablet(),
    mobile: () => isMobile(),
});
```

Then you can use it just like a regular `StyleSheet`

```typescript jsx
import { Text, View } from 'react-native';
import { MediaStyleSheet } from './MediaStyleSheet';

function HelloText(props: { name: string }) {
    return (
        <View style={styles.container}>
            <Text>Hello</Text>
            <Text>{props.name}</Text>
        </View>
    );
}

const styles = MediaStyleSheet.create({
    container: {
        justifyContent: 'center', // shared between both tablet and mobile styles
        tablet: {
            flexDirection: 'row',
        },
        mobile: {
            flexDirection: 'column',
        },
    },
});
```

This will provide a column based layout on mobile and a row based layout on tablet.

## Documentation

