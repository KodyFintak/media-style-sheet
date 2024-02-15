import 'react-native';
import { describe, expect, it } from '@jest/globals';
import { Image, Text } from 'react-native';
import { render } from '@testing-library/react-native';
import { createMediaStyleSheet } from '../MediaStyleSheet';

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

    describe('compiles', () => {
        it('with no flat level style', () => {
            const MediaThing = createMediaStyleSheet({
                myDevice: () => true,
                notMyDevice: () => false,
            });

            const styles = MediaThing.create({
                text: {
                    myDevice: {
                        color: 'red',
                    },
                    notMyDevice: {
                        color: 'red',
                    },
                },
            });

            function MyText() {
                return <Text style={styles.text}>Hello</Text>;
            }

            const renderAPI = render(<MyText />);

            expect(renderAPI.getByText('Hello').props.style).toEqual({ color: 'red' });
        });

        it('with 1 good prop and 1 bad prop for image', () => {
            const MediaThing = createMediaStyleSheet({
                myDevice: () => true,
            });

            const styles = MediaThing.create({
                image: {
                    myDevice: {
                        width: 22,
                        color: 'color-does-not-work-on-images',
                    },
                },
            });

            function MyImage() {
                return <Image testID={'image'} style={styles.image}></Image>;
            }

            const renderAPI = render(<MyImage />);

            expect(renderAPI.getByTestId('image').props.style).toEqual({
                width: 22,
                color: 'color-does-not-work-on-images',
            });
        });
    });
});
