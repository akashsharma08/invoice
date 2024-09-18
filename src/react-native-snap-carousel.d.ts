declare module 'react-native-snap-carousel' {
  import { Component } from 'react';
  import { ScrollViewProps, StyleProp, ViewStyle } from 'react-native';

  export interface CarouselProps<T> {
    data: T[];
    renderItem: ({ item, index }: { item: T; index: number }) => JSX.Element;
    sliderWidth: number;
    itemWidth: number;
    layout?: 'default' | 'stack' | 'tinder';
    onSnapToItem?: (index: number) => void;
    loop?: boolean;
    autoplay?: boolean;
    autoplayInterval?: number;
    containerCustomStyle?: StyleProp<ViewStyle>;
    contentContainerCustomStyle?: StyleProp<ViewStyle>;
    scrollInterpolator?: (index: number, carouselProps: CarouselProps<T>) => any;
    slideInterpolatedStyle?: (index: number, animatedValue: any, carouselProps: CarouselProps<T>) => any;
    inactiveSlideOpacity?: number;
    inactiveSlideScale?: number;
    enableMomentum?: boolean;
    enableSnap?: boolean;
    decelerationRate?: 'normal' | 'fast' | number;
    useScrollView?: boolean;
    scrollViewProps?: ScrollViewProps;
  }

  export default class Carousel<T> extends Component<CarouselProps<T>> {}
}
