import 'react-native';
import { describe, expect, it } from '@jest/globals';
import { createMediaStyleSheet } from '../MediaStyleSheet';
import { Text } from 'react-native';
import { render } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';

describe('media style sheet', () => {
    it('uses handheld styles', () => {
        const MediaStyleSheet = createMediaStyleSheet({
            handheld: () => true,
            tablet: () => false,
        });

        const styles = MediaStyleSheet.create({
            text: {
                fontSize: 22,
                handheld: {
                    color: 'green',
                },
                tablet: {
                    color: 'red',
                },
            },
        });

        function MyText() {
            return <Text style={styles.text}>Hello</Text>;
        }

        const renderAPI = render(<MyText />);

        expect(renderAPI.getByText('Hello').props.style).toEqual({ fontSize: 22, color: 'green' });
    });
    it('uses tablet styles', () => {
        const MediaStyleSheet = createMediaStyleSheet({
            handheld: () => false,
            tablet: () => true,
        });

        const styles = MediaStyleSheet.create({
            text: {
                fontSize: 22,
                handheld: {
                    color: 'green',
                },
                tablet: {
                    color: 'red',
                },
            },
        });

        function MyText() {
            return <Text style={styles.text}>Hello</Text>;
        }

        const renderAPI = render(<MyText />);

        expect(renderAPI.getByText('Hello').props.style).toEqual({ fontSize: 22, color: 'red' });
    });
});
