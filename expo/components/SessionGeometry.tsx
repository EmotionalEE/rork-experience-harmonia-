import React from "react";
import { Animated, StyleSheet, View } from "react-native";
import Svg, { Circle, Polygon, Path, G } from "react-native-svg";

interface SynchroGeometryProps {
  synchroSize: number;
  breatheScaleAnim: Animated.Value;
  rotateAnim: Animated.Value;
  rotateRevAnim: Animated.Value;
}

export const SynchroGeometry = React.memo(function SynchroGeometry({
  synchroSize,
  breatheScaleAnim,
  rotateAnim,
  rotateRevAnim,
}: SynchroGeometryProps) {
  return (
    <Animated.View
      style={[
        styles.synchroContainer,
        {
          width: synchroSize,
          height: synchroSize,
          transform: [{ scale: breatheScaleAnim }],
        },
      ]}
    >
      <Animated.View
        style={[
          styles.centered,
          { width: synchroSize, height: synchroSize },
          {
            transform: [
              {
                rotate: rotateAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '360deg'],
                }),
              },
            ],
          },
        ]}
      >
        <Svg width={synchroSize} height={synchroSize} viewBox="0 0 300 300">
          <G opacity={0.8}>
            {Array.from({ length: 7 }).map((_, i) => {
              const r = 40 + i * 18;
              const w = 1.5 + i * 0.3;
              const dash = i % 3 === 0 ? '10,6' : undefined;
              return (
                <Circle
                  key={i}
                  cx={150}
                  cy={150}
                  r={r}
                  fill="none"
                  stroke="white"
                  strokeOpacity={0.8}
                  strokeWidth={w}
                  strokeDasharray={dash}
                />
              );
            })}
          </G>
        </Svg>
      </Animated.View>

      <View style={[styles.centered, { width: synchroSize, height: synchroSize }]}>
        <Svg width={synchroSize} height={synchroSize} viewBox="0 0 300 300">
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * Math.PI) / 6;
            const cx = 150 + 60 * Math.cos(angle);
            const cy = 150 + 60 * Math.sin(angle);
            return (
              <Circle
                key={i}
                cx={cx}
                cy={cy}
                r={60}
                fill="none"
                stroke="white"
                strokeOpacity={0.25}
                strokeWidth={1.2}
              />
            );
          })}
        </Svg>
      </View>

      <Animated.View
        style={[
          styles.centered,
          { width: synchroSize, height: synchroSize },
          {
            transform: [
              {
                rotate: rotateRevAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '-360deg'],
                }),
              },
            ],
          },
        ]}
      >
        <Svg width={synchroSize} height={synchroSize} viewBox="0 0 300 300">
          <Polygon
            points="150,110 185,180 115,180"
            fill="none"
            stroke="#FFF7E6"
            strokeWidth={2}
            opacity={0.9}
          />
          <Polygon
            points="150,190 185,120 115,120"
            fill="none"
            stroke="#FFF7E6"
            strokeWidth={2}
            opacity={0.75}
          />
        </Svg>
      </Animated.View>

      <View style={[styles.centered, { width: synchroSize, height: synchroSize }]}>
        <Svg width={synchroSize} height={synchroSize} viewBox="0 0 300 300">
          <Circle cx={150} cy={150} r={12} fill="#FFF7E6" />
        </Svg>
      </View>
    </Animated.View>
  );
});

interface SacredGeometryProps {
  geometryBreathScale: Animated.AnimatedInterpolation<string | number>;
  geometryBreathOpacity: Animated.AnimatedInterpolation<string | number>;
  geometryGlowOpacity: Animated.AnimatedInterpolation<string | number>;
  geometryAnim: Animated.Value;
  mandalaAnim: Animated.Value;
}

export const SacredGeometry = React.memo(function SacredGeometry({
  geometryBreathScale,
  geometryBreathOpacity,
  geometryGlowOpacity,
  geometryAnim,
  mandalaAnim,
}: SacredGeometryProps) {
  return (
    <>
      <Animated.View
        style={[
          styles.bgGeometry,
          {
            opacity: geometryBreathOpacity,
            transform: [
              { scale: geometryBreathScale },
              {
                rotate: geometryAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '360deg'],
                }),
              },
            ],
          },
        ]}
      >
        <Svg width={520} height={520} style={styles.bgSvg}>
          <G opacity={0.42}>
            <Circle cx={260} cy={260} r={80} fill="none" stroke="#fff" strokeOpacity={0.85} strokeWidth={2.0} />
            <Circle cx={260} cy={200} r={80} fill="none" stroke="#fff" strokeOpacity={0.82} strokeWidth={1.4} />
            <Circle cx={260} cy={320} r={80} fill="none" stroke="#fff" strokeOpacity={0.82} strokeWidth={1.4} />
            <Circle cx={200} cy={230} r={80} fill="none" stroke="#fff" strokeOpacity={0.82} strokeWidth={1.4} />
            <Circle cx={320} cy={230} r={80} fill="none" stroke="#fff" strokeOpacity={0.82} strokeWidth={1.4} />
            <Circle cx={200} cy={290} r={80} fill="none" stroke="#fff" strokeOpacity={0.82} strokeWidth={1.4} />
            <Circle cx={320} cy={290} r={80} fill="none" stroke="#fff" strokeOpacity={0.82} strokeWidth={1.4} />
            <G opacity={0.72}>
              <Polygon
                points="260,140 340,200 340,320 260,380 180,320 180,200"
                fill="none"
                stroke="#fff"
                strokeOpacity={0.8}
                strokeWidth={1.2}
              />
              <Polygon
                points="260,180 310,210 310,310 260,340 210,310 210,210"
                fill="none"
                stroke="#fff"
                strokeOpacity={0.8}
                strokeWidth={1.2}
              />
            </G>
          </G>
        </Svg>
      </Animated.View>

      <Animated.View
        style={[
          styles.bgGeometry,
          {
            opacity: geometryGlowOpacity,
            transform: [
              { scale: Animated.multiply(1.07, geometryBreathScale) as any },
              {
                rotate: geometryAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '360deg'],
                }),
              },
            ],
          },
        ]}
      >
        <Svg width={520} height={520} style={styles.bgSvg}>
          <G opacity={0.72}>
            <Circle cx={260} cy={260} r={80} fill="none" stroke="#fff" strokeOpacity={0.78} strokeWidth={2.6} />
            <Circle cx={260} cy={200} r={80} fill="none" stroke="#fff" strokeOpacity={0.7} strokeWidth={2.6} />
            <Circle cx={260} cy={320} r={80} fill="none" stroke="#fff" strokeOpacity={0.7} strokeWidth={2.6} />
            <Circle cx={200} cy={230} r={80} fill="none" stroke="#fff" strokeOpacity={0.7} strokeWidth={2.6} />
            <Circle cx={320} cy={230} r={80} fill="none" stroke="#fff" strokeOpacity={0.7} strokeWidth={2.6} />
            <Circle cx={200} cy={290} r={80} fill="none" stroke="#fff" strokeOpacity={0.7} strokeWidth={2.6} />
            <Circle cx={320} cy={290} r={80} fill="none" stroke="#fff" strokeOpacity={0.7} strokeWidth={2.6} />
          </G>
        </Svg>
      </Animated.View>

      <MandalaLayer
        geometryBreathOpacity={geometryBreathOpacity}
        geometryBreathScale={geometryBreathScale}
        mandalaAnim={mandalaAnim}
      />

      <Animated.View
        style={[
          styles.bgMandala,
          {
            opacity: Animated.multiply(1.18, geometryGlowOpacity) as any,
            transform: [
              { scale: Animated.multiply(1.07, geometryBreathScale) as any },
              {
                rotate: mandalaAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '-360deg'],
                }),
              },
            ],
          },
        ]}
      >
        <Svg width={460} height={460} style={styles.bgSvg}>
          <G opacity={0.62}>
            {MANDALA_PATHS.map((d, i) => (
              <Path
                key={i}
                d={d}
                fill="none"
                stroke="#fff"
                strokeOpacity={0.7}
                strokeWidth={2.4}
              />
            ))}
            <Circle cx={230} cy={230} r={140} fill="none" stroke="#fff" strokeOpacity={0.58} strokeWidth={2.6} />
            <Circle cx={230} cy={230} r={70} fill="none" stroke="#fff" strokeOpacity={0.58} strokeWidth={2.6} />
          </G>
        </Svg>
      </Animated.View>
    </>
  );
});

const MandalaLayer = React.memo(function MandalaLayer({
  geometryBreathOpacity,
  geometryBreathScale,
  mandalaAnim,
}: {
  geometryBreathOpacity: Animated.AnimatedInterpolation<string | number>;
  geometryBreathScale: Animated.AnimatedInterpolation<string | number>;
  mandalaAnim: Animated.Value;
}) {
  return (
    <Animated.View
      style={[
        styles.bgMandala,
        {
          opacity: geometryBreathOpacity,
          transform: [
            { scale: geometryBreathScale },
            {
              rotate: mandalaAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '-360deg'],
              }),
            },
          ],
        },
      ]}
    >
      <Svg width={460} height={460} style={styles.bgSvg}>
        <G opacity={0.26}>
          {MANDALA_PATHS.map((d, i) => (
            <Path
              key={i}
              d={d}
              fill="none"
              stroke="#fff"
              strokeOpacity={0.78}
              strokeWidth={1.6}
            />
          ))}
          <Circle cx={230} cy={230} r={140} fill="none" stroke="#fff" strokeOpacity={0.72} strokeWidth={1.8} />
          <Circle cx={230} cy={230} r={70} fill="none" stroke="#fff" strokeOpacity={0.72} strokeWidth={1.8} />
        </G>
      </Svg>
    </Animated.View>
  );
});

interface UnwindGeometryProps {
  geometryBreathScale: Animated.AnimatedInterpolation<string | number>;
  geometryBreathOpacity: Animated.AnimatedInterpolation<string | number>;
  geometryGlowOpacity: Animated.AnimatedInterpolation<string | number>;
  geometryAnim: Animated.Value;
  mandalaAnim: Animated.Value;
}

function generateSpiralPath(cx: number, cy: number, startR: number, endR: number, turns: number, direction: number): string {
  const points: string[] = [];
  const steps = 120;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const angle = t * turns * Math.PI * 2 * direction;
    const r = startR + (endR - startR) * t;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    points.push(i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`);
  }
  return points.join(' ');
}

function generateFlowingWave(cx: number, cy: number, radius: number, waves: number, amplitude: number): string {
  const points: string[] = [];
  const steps = 180;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const angle = t * Math.PI * 2;
    const waveOffset = Math.sin(t * waves * Math.PI * 2) * amplitude;
    const r = radius + waveOffset;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    points.push(i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`);
  }
  return points.join(' ') + ' Z';
}

function generatePetalPath(cx: number, cy: number, innerR: number, outerR: number, petalAngle: number, rotation: number): string {
  const a1 = rotation - petalAngle / 2;
  const a2 = rotation + petalAngle / 2;
  const cp1Angle = rotation - petalAngle * 0.15;
  const cp2Angle = rotation + petalAngle * 0.15;
  const startX = cx + innerR * Math.cos(a1);
  const startY = cy + innerR * Math.sin(a1);
  const cp1X = cx + outerR * 1.1 * Math.cos(cp1Angle);
  const cp1Y = cy + outerR * 1.1 * Math.sin(cp1Angle);
  const tipX = cx + outerR * Math.cos(rotation);
  const tipY = cy + outerR * Math.sin(rotation);
  const cp2X = cx + outerR * 1.1 * Math.cos(cp2Angle);
  const cp2Y = cy + outerR * 1.1 * Math.sin(cp2Angle);
  const endX = cx + innerR * Math.cos(a2);
  const endY = cy + innerR * Math.sin(a2);
  return `M ${startX} ${startY} Q ${cp1X} ${cp1Y} ${tipX} ${tipY} Q ${cp2X} ${cp2Y} ${endX} ${endY}`;
}

const UNWIND_SPIRALS = [
  generateSpiralPath(260, 260, 8, 180, 3.5, 1),
  generateSpiralPath(260, 260, 8, 160, 3, -1),
  generateSpiralPath(260, 260, 12, 140, 2.5, 1),
];

const UNWIND_WAVES = [
  generateFlowingWave(260, 260, 60, 6, 8),
  generateFlowingWave(260, 260, 100, 8, 12),
  generateFlowingWave(260, 260, 140, 10, 10),
  generateFlowingWave(260, 260, 180, 12, 8),
];

const UNWIND_PETALS_INNER = Array.from({ length: 8 }).map((_, i) => {
  const rotation = (i * Math.PI * 2) / 8;
  return generatePetalPath(260, 260, 20, 80, 0.6, rotation);
});

const UNWIND_PETALS_OUTER = Array.from({ length: 12 }).map((_, i) => {
  const rotation = (i * Math.PI * 2) / 12 + Math.PI / 12;
  return generatePetalPath(260, 260, 50, 150, 0.4, rotation);
});

const DISSOLVE_RINGS = Array.from({ length: 6 }).map((_, i) => {
  const r = 30 + i * 30;
  const dashLen = 4 + i * 3;
  const gapLen = 2 + i * 4;
  return { r, dash: `${dashLen},${gapLen}`, opacity: 0.7 - i * 0.08, width: 1.8 - i * 0.15 };
});

export const UnwindGeometry = React.memo(function UnwindGeometry({
  geometryBreathScale,
  geometryBreathOpacity,
  geometryGlowOpacity,
  geometryAnim,
  mandalaAnim,
}: UnwindGeometryProps) {
  return (
    <>
      <Animated.View
        style={[
          styles.bgGeometry,
          {
            opacity: geometryBreathOpacity,
            transform: [
              { scale: geometryBreathScale },
              {
                rotate: geometryAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '360deg'],
                }),
              },
            ],
          },
        ]}
      >
        <Svg width={520} height={520} style={styles.bgSvg}>
          <G opacity={0.35}>
            {UNWIND_SPIRALS.map((d, i) => (
              <Path
                key={`spiral-${i}`}
                d={d}
                fill="none"
                stroke="#FFF7E6"
                strokeOpacity={0.85 - i * 0.12}
                strokeWidth={2.2 - i * 0.3}
                strokeLinecap="round"
              />
            ))}
          </G>
          <G opacity={0.25}>
            {DISSOLVE_RINGS.map((ring, i) => (
              <Circle
                key={`ring-${i}`}
                cx={260}
                cy={260}
                r={ring.r}
                fill="none"
                stroke="#FFF7E6"
                strokeOpacity={ring.opacity}
                strokeWidth={ring.width}
                strokeDasharray={ring.dash}
              />
            ))}
          </G>
        </Svg>
      </Animated.View>

      <Animated.View
        style={[
          styles.bgGeometry,
          {
            opacity: geometryGlowOpacity,
            transform: [
              { scale: Animated.multiply(1.05, geometryBreathScale) as any },
              {
                rotate: geometryAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '360deg'],
                }),
              },
            ],
          },
        ]}
      >
        <Svg width={520} height={520} style={styles.bgSvg}>
          <G opacity={0.5}>
            {UNWIND_SPIRALS.map((d, i) => (
              <Path
                key={`glow-spiral-${i}`}
                d={d}
                fill="none"
                stroke="#FFECC8"
                strokeOpacity={0.6 - i * 0.1}
                strokeWidth={3.5 - i * 0.4}
                strokeLinecap="round"
              />
            ))}
          </G>
        </Svg>
      </Animated.View>

      <Animated.View
        style={[
          styles.bgMandala,
          {
            opacity: geometryBreathOpacity,
            transform: [
              { scale: geometryBreathScale },
              {
                rotate: mandalaAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '-360deg'],
                }),
              },
            ],
          },
        ]}
      >
        <Svg width={520} height={520} style={styles.bgSvg}>
          <G opacity={0.3}>
            {UNWIND_PETALS_INNER.map((d, i) => (
              <Path
                key={`petal-inner-${i}`}
                d={d}
                fill="none"
                stroke="#fff"
                strokeOpacity={0.65}
                strokeWidth={1.4}
                strokeLinecap="round"
              />
            ))}
          </G>
          <G opacity={0.22}>
            {UNWIND_PETALS_OUTER.map((d, i) => (
              <Path
                key={`petal-outer-${i}`}
                d={d}
                fill="none"
                stroke="#FFF7E6"
                strokeOpacity={0.55}
                strokeWidth={1.2}
                strokeLinecap="round"
              />
            ))}
          </G>
        </Svg>
      </Animated.View>

      <Animated.View
        style={[
          styles.bgGeometry,
          {
            opacity: Animated.multiply(0.9, geometryBreathOpacity) as any,
            transform: [
              { scale: Animated.multiply(0.95, geometryBreathScale) as any },
              {
                rotate: geometryAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '180deg'],
                }),
              },
            ],
          },
        ]}
      >
        <Svg width={520} height={520} style={styles.bgSvg}>
          <G opacity={0.2}>
            {UNWIND_WAVES.map((d, i) => (
              <Path
                key={`wave-${i}`}
                d={d}
                fill="none"
                stroke="#fff"
                strokeOpacity={0.5 - i * 0.06}
                strokeWidth={1.0 + i * 0.15}
                strokeLinejoin="round"
              />
            ))}
          </G>
        </Svg>
      </Animated.View>

      <Animated.View
        style={[
          styles.bgMandala,
          {
            opacity: Animated.multiply(1.1, geometryGlowOpacity) as any,
            transform: [
              { scale: Animated.multiply(1.08, geometryBreathScale) as any },
              {
                rotate: mandalaAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '-360deg'],
                }),
              },
            ],
          },
        ]}
      >
        <Svg width={520} height={520} style={styles.bgSvg}>
          <G opacity={0.4}>
            {UNWIND_PETALS_INNER.map((d, i) => (
              <Path
                key={`glow-petal-${i}`}
                d={d}
                fill="none"
                stroke="#FFECC8"
                strokeOpacity={0.5}
                strokeWidth={2.4}
                strokeLinecap="round"
              />
            ))}
          </G>
          <G opacity={0.18}>
            <Circle cx={260} cy={260} r={18} fill="#FFF7E6" fillOpacity={0.3} />
            <Circle cx={260} cy={260} r={8} fill="#FFF7E6" fillOpacity={0.5} />
          </G>
        </Svg>
      </Animated.View>
    </>
  );
});

interface QuietAlarmGeometryProps {
  geometryBreathScale: Animated.AnimatedInterpolation<string | number>;
  geometryBreathOpacity: Animated.AnimatedInterpolation<string | number>;
  geometryGlowOpacity: Animated.AnimatedInterpolation<string | number>;
  geometryAnim: Animated.Value;
  mandalaAnim: Animated.Value;
}

function generateSettlingRipple(cx: number, cy: number, radius: number, wobble: number, phase: number): string {
  const points: string[] = [];
  const steps = 120;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const angle = t * Math.PI * 2;
    const offset = Math.sin(angle * wobble + phase) * (radius * 0.06);
    const r = radius + offset;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    points.push(i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`);
  }
  return points.join(' ') + ' Z';
}

function generateDissipatingArc(cx: number, cy: number, radius: number, startAngle: number, sweep: number): string {
  const steps = 40;
  const points: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const angle = startAngle + t * sweep;
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    points.push(i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`);
  }
  return points.join(' ');
}

function generateVesicaOverlap(cx: number, cy: number, r: number, angle: number): string {
  const dx = r * 0.5 * Math.cos(angle);
  const dy = r * 0.5 * Math.sin(angle);
  const c1x = cx + dx;
  const c1y = cy + dy;
  const c2x = cx - dx;
  const c2y = cy - dy;
  const pts: string[] = [];
  const steps = 60;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const a = t * Math.PI * 2;
    const x = c1x + r * Math.cos(a);
    const y = c1y + r * Math.sin(a);
    pts.push(i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`);
  }
  let path = pts.join(' ') + ' Z ';
  const pts2: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const a = t * Math.PI * 2;
    const x = c2x + r * Math.cos(a);
    const y = c2y + r * Math.sin(a);
    pts2.push(i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`);
  }
  path += pts2.join(' ') + ' Z';
  return path;
}

function generateBreathCurve(cx: number, cy: number, innerR: number, outerR: number, segments: number): string[] {
  const paths: string[] = [];
  for (let i = 0; i < segments; i++) {
    const a1 = (i / segments) * Math.PI * 2;
    const a2 = ((i + 0.5) / segments) * Math.PI * 2;
    const a3 = ((i + 1) / segments) * Math.PI * 2;
    const sx = cx + innerR * Math.cos(a1);
    const sy = cy + innerR * Math.sin(a1);
    const cpx = cx + outerR * Math.cos(a2);
    const cpy = cy + outerR * Math.sin(a2);
    const ex = cx + innerR * Math.cos(a3);
    const ey = cy + innerR * Math.sin(a3);
    paths.push(`M ${sx} ${sy} Q ${cpx} ${cpy} ${ex} ${ey}`);
  }
  return paths;
}

const QA_CENTER = 260;
const QA_RIPPLES = Array.from({ length: 8 }).map((_, i) => {
  const r = 25 + i * 22;
  const wobble = 3 + i;
  const phase = i * 0.7;
  return generateSettlingRipple(QA_CENTER, QA_CENTER, r, wobble, phase);
});

const QA_ARCS = Array.from({ length: 16 }).map((_, i) => {
  const angle = (i / 16) * Math.PI * 2;
  const radius = 60 + (i % 4) * 35;
  const sweep = Math.PI * (0.3 + (i % 3) * 0.15);
  return { path: generateDissipatingArc(QA_CENTER, QA_CENTER, radius, angle, sweep), radius };
});

const QA_VESICAS = Array.from({ length: 6 }).map((_, i) => {
  const angle = (i / 6) * Math.PI;
  return generateVesicaOverlap(QA_CENTER, QA_CENTER, 55, angle);
});

const QA_BREATH_OUTER = generateBreathCurve(QA_CENTER, QA_CENTER, 120, 170, 10);
const QA_BREATH_INNER = generateBreathCurve(QA_CENTER, QA_CENTER, 40, 75, 6);

const QA_FADE_RINGS = Array.from({ length: 5 }).map((_, i) => {
  const r = 140 + i * 18;
  const dashLen = 12 - i * 1.5;
  const gapLen = 6 + i * 4;
  return { r, dash: `${dashLen},${gapLen}`, opacity: 0.5 - i * 0.08, width: 1.4 - i * 0.15 };
});

export const QuietAlarmGeometry = React.memo(function QuietAlarmGeometry({
  geometryBreathScale,
  geometryBreathOpacity,
  geometryGlowOpacity,
  geometryAnim,
  mandalaAnim,
}: QuietAlarmGeometryProps) {
  return (
    <>
      <Animated.View
        style={[
          styles.bgGeometry,
          {
            opacity: geometryBreathOpacity,
            transform: [
              { scale: geometryBreathScale },
              {
                rotate: geometryAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '180deg'],
                }),
              },
            ],
          },
        ]}
      >
        <Svg width={520} height={520} style={styles.bgSvg}>
          <G opacity={0.3}>
            {QA_RIPPLES.map((d, i) => (
              <Path
                key={`ripple-${i}`}
                d={d}
                fill="none"
                stroke="#FFE4E1"
                strokeOpacity={0.7 - i * 0.06}
                strokeWidth={1.8 - i * 0.12}
                strokeLinejoin="round"
              />
            ))}
          </G>
          <G opacity={0.22}>
            {QA_FADE_RINGS.map((ring, i) => (
              <Circle
                key={`fade-${i}`}
                cx={QA_CENTER}
                cy={QA_CENTER}
                r={ring.r}
                fill="none"
                stroke="#FFD5CC"
                strokeOpacity={ring.opacity}
                strokeWidth={ring.width}
                strokeDasharray={ring.dash}
              />
            ))}
          </G>
        </Svg>
      </Animated.View>

      <Animated.View
        style={[
          styles.bgGeometry,
          {
            opacity: geometryGlowOpacity,
            transform: [
              { scale: Animated.multiply(1.06, geometryBreathScale) as any },
              {
                rotate: geometryAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '180deg'],
                }),
              },
            ],
          },
        ]}
      >
        <Svg width={520} height={520} style={styles.bgSvg}>
          <G opacity={0.45}>
            {QA_RIPPLES.slice(0, 5).map((d, i) => (
              <Path
                key={`glow-ripple-${i}`}
                d={d}
                fill="none"
                stroke="#FFDDD6"
                strokeOpacity={0.55 - i * 0.08}
                strokeWidth={2.8 - i * 0.3}
                strokeLinejoin="round"
              />
            ))}
          </G>
        </Svg>
      </Animated.View>

      <Animated.View
        style={[
          styles.bgMandala,
          {
            opacity: geometryBreathOpacity,
            transform: [
              { scale: geometryBreathScale },
              {
                rotate: mandalaAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '-360deg'],
                }),
              },
            ],
          },
        ]}
      >
        <Svg width={520} height={520} style={styles.bgSvg}>
          <G opacity={0.2}>
            {QA_VESICAS.map((d, i) => (
              <Path
                key={`vesica-${i}`}
                d={d}
                fill="none"
                stroke="#fff"
                strokeOpacity={0.5}
                strokeWidth={1.0}
              />
            ))}
          </G>
          <G opacity={0.28}>
            {QA_ARCS.map((arc, i) => (
              <Path
                key={`arc-${i}`}
                d={arc.path}
                fill="none"
                stroke="#FFE8E0"
                strokeOpacity={0.6 - (i % 4) * 0.1}
                strokeWidth={1.2}
                strokeLinecap="round"
              />
            ))}
          </G>
        </Svg>
      </Animated.View>

      <Animated.View
        style={[
          styles.bgGeometry,
          {
            opacity: Animated.multiply(0.85, geometryBreathOpacity) as any,
            transform: [
              { scale: Animated.multiply(0.92, geometryBreathScale) as any },
              {
                rotate: geometryAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '-120deg'],
                }),
              },
            ],
          },
        ]}
      >
        <Svg width={520} height={520} style={styles.bgSvg}>
          <G opacity={0.25}>
            {QA_BREATH_OUTER.map((d, i) => (
              <Path
                key={`breath-outer-${i}`}
                d={d}
                fill="none"
                stroke="#fff"
                strokeOpacity={0.45}
                strokeWidth={1.1}
                strokeLinecap="round"
              />
            ))}
          </G>
          <G opacity={0.32}>
            {QA_BREATH_INNER.map((d, i) => (
              <Path
                key={`breath-inner-${i}`}
                d={d}
                fill="none"
                stroke="#FFDDD6"
                strokeOpacity={0.6}
                strokeWidth={1.3}
                strokeLinecap="round"
              />
            ))}
          </G>
        </Svg>
      </Animated.View>

      <Animated.View
        style={[
          styles.bgMandala,
          {
            opacity: Animated.multiply(1.1, geometryGlowOpacity) as any,
            transform: [
              { scale: Animated.multiply(1.04, geometryBreathScale) as any },
              {
                rotate: mandalaAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '-180deg'],
                }),
              },
            ],
          },
        ]}
      >
        <Svg width={520} height={520} style={styles.bgSvg}>
          <G opacity={0.35}>
            {QA_BREATH_INNER.map((d, i) => (
              <Path
                key={`glow-inner-${i}`}
                d={d}
                fill="none"
                stroke="#FFD0C5"
                strokeOpacity={0.5}
                strokeWidth={2.2}
                strokeLinecap="round"
              />
            ))}
          </G>
          <G opacity={0.25}>
            <Circle cx={QA_CENTER} cy={QA_CENTER} r={22} fill="#FFE4E1" fillOpacity={0.18} />
            <Circle cx={QA_CENTER} cy={QA_CENTER} r={10} fill="#FFE4E1" fillOpacity={0.35} />
            <Circle cx={QA_CENTER} cy={QA_CENTER} r={4} fill="#fff" fillOpacity={0.5} />
          </G>
        </Svg>
      </Animated.View>
    </>
  );
});

const MANDALA_PATHS: string[] = Array.from({ length: 16 }).map((_, i) => {
  const angle = (i * 22.5) * Math.PI / 180;
  const x1 = 230 + Math.cos(angle) * 150;
  const y1 = 230 + Math.sin(angle) * 150;
  const x2 = 230 + Math.cos(angle) * 180;
  const y2 = 230 + Math.sin(angle) * 180;
  return `M 230 230 L ${x1} ${y1} L ${x2} ${y2} Z`;
});

const styles = StyleSheet.create({
  synchroContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centered: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bgGeometry: {
    position: 'absolute',
    width: 520,
    height: 520,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bgMandala: {
    position: 'absolute',
    width: 460,
    height: 460,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bgSvg: {
    position: 'absolute',
  },
});
