import 'react-native';
import { describe, expect, it } from '@jest/globals';
import { createMediaStyleSheet } from '../MediaStyleSheet';
import { Text } from 'react-native';
import { render } from '@testing-library/react-native';

describe('media style sheet', () => {
    it('something', () => {
        const MediaStyleSheet = createMediaStyleSheet({
            isHandheld: () => true,
            isTablet: () => false,
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
});
