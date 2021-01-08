type BaseExperimentProps = {
  /** Instructions for the participant to complete the experiment  */
  instructions: string;
  /** Background color of experiment */
  background: any;
  /** Use to adjust the width of canvas */
  width: any;
  /** Use to adjust the height of canvas */
  height: any;
  /** Function called on experiment start */
  onStart?(): void;
  /** Function called on experiment end */
  onEnd?(): void;
};

export type CalibrationProps = BaseExperimentProps & {
  /** Defines how long to wait between rendering a new dot on the screen  */
  duration: number;
  /** Defines the radius of the dots  */
  radius: number;
  /** Defines the color of the dots  */
  dot_color: string;
  /** Determines the x,y coordinates of the sequence of dots on the screen */
  dot_points: [number, number][];
  /**
  Function called when calibration circle is updated.
  Returns the circle's center point relative to the canvas.
      (0, 0) represents the top left of the canvas.
      (1, 1) represents the bottom right of the canvas.
  */
  onUpdate?(x: number, y: number): void;
};

export type NystagmusProps = BaseExperimentProps & {
  /** The amount of time (in seconds) the focal point pauses when at the far left and far right side of screen  */
  pause_time: number;
  /** The amount of time that passes before the assessment starts  */
  start_pause_time: number;
  /** Defines how many iterations that the assesment will cycle through  */
  iterations: number;
  /** Defines how fast the moving target moves across the screen  */
  speed: number;
  /** Defines the width and height of the focal point  */
  targetSize: number;
  /** The color of the moving focal point  */
  targetColor: string;
  /** initial x-position of the focal point in the experiment */
  initialX: number;
};

export type PlrProps = BaseExperimentProps & {
  /** Dictates the color sequence of the background */
  color_values: [number];
  /** The centered cross width  */
  fixation_width: number;
  /** Defines the centered cross length  */
  fixation_length: number;
  /** Defines how thick the outline on the centered cross, set to 0 to make outline disappear  */
  fixation_outline_size: number;
  /** Defines the time that passes until the next screen is displayed  */
  duration: number;
};
