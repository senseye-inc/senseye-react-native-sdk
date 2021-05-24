import * as React from 'react';
import Svg, { G, Path } from 'react-native-svg';
export type FaceOutlineProps = {
  outlineColor?: string;
  height?: number | string;
  width?: number | string;
};

/** Dynamic face box outline for face alignment */
function FaceOutline(props: FaceOutlineProps) {
  const { outlineColor } = props;
  return (
    <Svg viewBox="0 0 197.7 284.56" {...props}>
      <G data-name="Layer 3">
        <Path
          d="M98.84 221.48a42.56 42.56 0 01-6.51-2.43c-10.68 1.35-18.71 6.37-23.79 9.44"
          fill="none"
          stroke={outlineColor}
          strokeLinecap="round"
          strokeWidth={1.5}
        />
        <Path
          d="M98.83 231.45c-4.26 0-5.72-1.92-7.56-3-9.87-1.36-11.37 2.46-22.73.07-1.06-.23-3.16-.94-3.89-2.41M98.88 231.45c4.26 0 5.72-1.92 7.55-3 9.87-1.36 11.38 3 22.74.07 1-.28 3.16-.94 3.88-2.41"
          fill="none"
          stroke={outlineColor}
          strokeLinecap="round"
          strokeWidth={1.5}
        />
        <Path
          d="M98.87 221.48a42.56 42.56 0 006.51-2.43c10.67 1.35 18.7 6.37 23.79 9.44"
          fill="none"
          stroke={outlineColor}
          strokeLinecap="round"
          strokeWidth={1.5}
        />
        <Path
          d="M123.05 233.95c-4.84 5.34-9.69 9.4-24.18 9.4s-19.34-4.06-24.19-9.4"
          fill="none"
          stroke={outlineColor}
          strokeLinecap="round"
          strokeWidth={1.466}
        />
        <Path
          d="M182.73 135.42c6.38-5.1 17.1-4.12 13.5 19.28-4.39 29.63-8.15 36.84-20.53 46.07"
          fill="none"
          stroke={outlineColor}
          strokeWidth={1.5}
        />
        <Path
          d="M183.03 157.86c2.49.84 4 4.38 3.48 8.37-.47 3.5-2.38 6.29-4.61 7.06M181.09 154.75c2.56-10.38 7.76-18 10.29-17.57M192.41 162.75a36.41 36.41 0 00-4.33-23.19M191.57 167.56a36.5 36.5 0 01-10.48 20.92M14.98 135.42c-6.38-5.1-17.11-4.12-13.51 19.28 4.39 29.63 8.16 36.84 20.53 46.07"
          fill="none"
          stroke={outlineColor}
          strokeWidth={1.5}
        />
        <Path
          d="M14.67 157.86c-2.48.84-4 4.38-3.48 8.37.47 3.5 2.38 6.29 4.61 7.06M16.61 154.75c-2.55-10.38-7.76-18-10.28-17.57M5.29 162.75a36.34 36.34 0 014.34-23.19M6.15 167.56a36.44 36.44 0 0010.47 20.92M176.01 128.92a112.16 112.16 0 004.52 15.4 32.53 32.53 0 011.36-4.6M149.91 51.51c14.75 8.58 22.31 21 23 33.61.93 16.52.53 26.65 1.94 37.1M25.23 81.3c3.8-21.3 29.48-41.12 75.23-41.08A121.6 121.6 0 01134.9 45c11 3.24 15 8 18.53-2.61M17.15 144.32c6.32-21.71 6.12-31.68 7.51-57.31"
          fill="none"
          stroke={outlineColor}
          strokeWidth={1.5}
        />
        <Path
          d="M186.35 132.83c1.44-12.27 0-37.31-.15-48.53-.59-41.07-5.26-64.8-34-63.25C143.59.04 113.42.75 98.85.75 69.72.75 11.27 2.15 11.5 84.3c0 11.22-.91 41.4-.15 48.53M15.95 147.42c1.17 15 6.52 51.06 10.44 77.54 2 13.6 27.07 39.7 50.36 53.06 2.08 1.19 12.09 5.79 22.1 5.79s20-4.6 22.1-5.79c23.29-13.36 48.36-39.46 50.37-53.06 3.91-26.48 9.26-62.5 10.44-77.54M42.21 142.21c6.53-5.34 14.35-8.19 22.11-7.34 3.75.42 5.14 2.8 9.92 5.82"
          fill="none"
          stroke={outlineColor}
          strokeWidth={1.5}
        />
        <Path
          d="M76.58 152.26a2.35 2.35 0 00-2.17-1.24c-5.88.16-6.88 3.74-14.69 4.83-9.64 1.35-16.36-5.53-18.57-10.22"
          fill="none"
          stroke={outlineColor}
          strokeWidth={1.5}
        />
        <Path
          d="M37.27 146.27c7.88 0 10.46-7.33 22.7-7.33 9.27 0 8.74 5.79 19.7 10.1"
          fill="none"
          stroke={outlineColor}
          strokeWidth={1.5}
        />
        <Path
          d="M50.22 142.98a23 23 0 019.75-2 12.89 12.89 0 016.93 1.69M65.75 139.92a8.5 8.5 0 11-14.6.43"
          fill="none"
          stroke={outlineColor}
          strokeWidth={1.5}
        />
        <Path
          d="M60.91 145.75a2.27 2.27 0 01-.34-4.52 3.85 3.85 0 101.86 3.93 2.27 2.27 0 01-1.52.59z"
          fill={outlineColor}
        />
        <Path
          d="M155.46 142.21c-6.53-5.34-14.34-8.19-22.11-7.34-3.75.42-5.14 2.8-9.91 5.82M121.09 152.26a2.36 2.36 0 012.17-1.24c5.88.16 6.88 3.74 14.69 4.83 9.65 1.35 16.37-5.53 18.57-10.22"
          fill="none"
          stroke={outlineColor}
          strokeWidth={1.5}
        />
        <Path
          d="M160.4 146.27c-7.88 0-10.45-7.33-22.7-7.33-9.27 0-8.73 5.79-19.69 10.1"
          fill="none"
          stroke={outlineColor}
          strokeWidth={1.5}
        />
        <Path
          d="M147.46 142.98a23.05 23.05 0 00-9.76-2 12.89 12.89 0 00-6.93 1.69"
          fill="none"
          stroke={outlineColor}
          strokeWidth={1.5}
        />
        <Path
          d="M131.93 139.92a8.41 8.41 0 00-1.35 4.6 8.51 8.51 0 1015.93-4.17"
          fill="none"
          stroke={outlineColor}
          strokeWidth={1.5}
        />
        <Path
          d="M141.36 145.75a2.27 2.27 0 01-.34-4.52 3.85 3.85 0 101.86 3.93 2.27 2.27 0 01-1.52.59z"
          fill={outlineColor}
        />
        <Path
          d="M104.64 202.65c0-4 3.64-5 7.28-4.21M109.06 201.44c2.86 1.21 6.18 1 7.8-1.85 1.13-2 2.09-6.53-2.37-10.78M93.06 202.65c0-4-2.81-5-7.28-4.21"
          fill="none"
          stroke={outlineColor}
          strokeLinecap="round"
          strokeWidth={1.5}
        />
        <Path
          d="M88.65 201.44c-2.87 1.21-6.18 1-7.81-1.85-1.12-2-2.09-6.53 2.37-10.78"
          fill="none"
          stroke={outlineColor}
          strokeLinecap="round"
          strokeWidth={1.5}
        />
        <Path
          d="M118.55 126.91c-4.28 1.18-5.48 7.94-1.49 6.89 8.1-2.15 24-7.44 34.58-7.52 3.14 0 8.2 1.28 12.65 2.77"
          fill="none"
          stroke={outlineColor}
          strokeWidth={1.5}
        />
        <Path
          d="M168.76 129.56c-4.06-2.4-12.36-6.56-22-7.19-8.23-.54-18.06 1.81-25.27 3.74M81.39 128.26c2.29 2.31 2.38 6.37-.77 5.54-8.11-2.15-24-7.44-34.59-7.52-3.14 0-8.2 1.28-12.64 2.77"
          fill="none"
          stroke={outlineColor}
          strokeWidth={1.5}
        />
        <Path
          d="M28.92 129.56c4.06-2.4 12.35-6.56 22-7.19 9.42-.62 20.94 2.55 28.22 4.54M14.66 141.05a149.24 149.24 0 001.82-21.09M184.24 113.56a149.93 149.93 0 00.29 21.17M151.81 50c6.86 3.37 15.68 10.41 19.2 13.38M109.06 45.46c6.9-.45 22.92 1 33 5.15"
          fill="none"
          stroke={outlineColor}
          strokeWidth={1.5}
        />
      </G>
    </Svg>
  );
}
FaceOutline.defaultProps = {
  outlineColor: '#9FB7C6',
  height: '100%',
  width: '100%',
};
export default FaceOutline;
