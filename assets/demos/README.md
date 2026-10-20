# Real simulation demonstrations

Sixteen selected Base-success / Dynamic-failure pairs, two for each LIBERO-MAX event type, replayed from the evaluated pi0.5-LIBERO action traces. Each comparison retains the complete recorded horizon, shared pre-event history, event step and both terminal outcomes. Native simulator camera frames are 256 × 256; comparison exports are 600 × 432. No generated robot motion or interpolated simulation states are used.

`manifest.json` identifies every case, event step, success/failure and replay error. All sixteen replays matched recorded end-effector positions exactly and matched the recorded goal predicate at every step.

`*-wall.mp4` contains only the Dynamic arm. The 16-case montage is 1056 × 1200, H.264, silent and 16.2 seconds; shorter clips hold their final frame. Different cases do not share a common event step.

The main homepage provides two sets of eight tiles and full paired comparisons. `../../demos.html` provides all sixteen tiles. Media uses native browser playback and respects reduced-motion preferences for the autoplay wall.
