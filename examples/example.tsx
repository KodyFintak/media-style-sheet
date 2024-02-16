import React from 'react';
import { Text, View } from 'react-native';
import { createMediaStyleSheet } from '../src';

function isTablet() {
    return false;
}

function isMobile() {
    return true;
}

export const MediaStyleSheet = createMediaStyleSheet({
    tablet: () => isTablet(),
    mobile: () => isMobile(),
});

function Example(props: { name: string }) {
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
