"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  Heart,
  Thermometer,
  Droplet,
  Wind,
  Zap,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";

interface DeviceData {
  heartRate: number;
  temperature: number;
  bloodOxygen: number;
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  respiratoryRate: number;
  steps: number;
  calories: number;
  timestamp: Date;
}

interface ChartDataPoint {
  time: string;
  heartRate: number;
  temperature: number;
  bloodOxygen: number;
  respiratoryRate: number;
}

// Generate realistic mock IoT data with more variation
const generateMockData = (previous?: DeviceData): DeviceData => {
  const baseHR = 72;
  const baseTemp = 98.6;
  const baseO2 = 98;
  const baseSystolic = 120;
  const baseDiastolic = 80;
  const baseRR = 16;

  const randomVariation = () => (Math.random() - 0.5) * 2;

  return {
    heartRate: previous
      ? Math.max(60, Math.min(100, previous.heartRate + randomVariation() * 3))
      : baseHR + randomVariation() * 10,
    temperature: previous
      ? Math.max(97, Math.min(99.5, previous.temperature + randomVariation() * 0.4))
      : baseTemp + randomVariation() * 1.5,
    bloodOxygen: previous
      ? Math.max(95, Math.min(100, previous.bloodOxygen + randomVariation() * 1.5))
      : baseO2 + randomVariation() * 3,
    bloodPressureSystolic: previous
      ? Math.max(110, Math.min(140, previous.bloodPressureSystolic + randomVariation() * 4))
      : baseSystolic + randomVariation() * 15,
    bloodPressureDiastolic: previous
      ? Math.max(70, Math.min(95, previous.bloodPressureDiastolic + randomVariation() * 3))
      : baseDiastolic + randomVariation() * 10,
    respiratoryRate: previous
      ? Math.max(12, Math.min(20, previous.respiratoryRate + randomVariation() * 1.5))
      : baseRR + randomVariation() * 5,
    steps: previous ? previous.steps + Math.floor(Math.random() * 80) : Math.floor(Math.random() * 5000),
    calories: previous ? previous.calories + Math.floor(Math.random() * 15) : Math.floor(Math.random() * 1500),
    timestamp: new Date(),
  };
};

// Simple bar chart component
const SimpleBarChart = ({ data, color, label }: { data: number[]; color: string; label: string }) => {
  const maxValue = Math.max(...data);
  const minValue = Math.min(...data);
  const range = maxValue - minValue || 1;

  return (
    <div className="h-48 flex items-end justify-between gap-1 px-2 bg-muted/20 rounded-lg p-2">
      {data.map((value, index) => {
        // Calculate height percentage with minimum 10% to ensure visibility
        const heightPercent = Math.max(10, ((value - minValue) / range) * 90);
        return (
          <div key={index} className="flex-1 flex flex-col items-center gap-1 group relative min-w-[8px]">
            <div
              className={`w-full rounded-t transition-all duration-500 ${color} min-h-[8px]`}
              style={{ height: `${heightPercent}%` }}
            />
            <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-background border border-border rounded px-2 py-1 text-xs whitespace-nowrap z-10 shadow-lg">
              <div className="font-semibold">{value.toFixed(1)}</div>
              <div className="text-[10px] text-muted-foreground">{label}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Line chart component with enhanced styling
const SimpleLineChart = ({ data, color, label }: { data: number[]; color: string; label: string }) => {
  const maxValue = Math.max(...data);
  const minValue = Math.min(...data);
  const range = maxValue - minValue || 1;

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((value - minValue) / range) * 80 - 10;
    return `${x},${y}`;
  }).join(" ");

  return (
    <div className="h-48 relative bg-muted/20 rounded-lg p-2">
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Grid lines */}
        <line x1="0" y1="25" x2="100" y2="25" stroke="currentColor" strokeOpacity="0.1" strokeWidth="0.5" />
        <line x1="0" y1="50" x2="100" y2="50" stroke="currentColor" strokeOpacity="0.1" strokeWidth="0.5" />
        <line x1="0" y1="75" x2="100" y2="75" stroke="currentColor" strokeOpacity="0.1" strokeWidth="0.5" />

        {/* Line with gradient stroke */}
        <defs>
          <linearGradient id={`gradient-${label}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: color, stopOpacity: 0.8 }} />
            <stop offset="100%" style={{ stopColor: color, stopOpacity: 1 }} />
          </linearGradient>
        </defs>
        <polyline
          fill="none"
          stroke={`url(#gradient-${label})`}
          strokeWidth="3"
          points={points}
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {data.map((value, index) => {
          const x = (index / (data.length - 1)) * 100;
          const y = 100 - ((value - minValue) / range) * 80 - 10;
          return (
            <g key={index} className="group">
              <circle
                cx={x}
                cy={y}
                r="2"
                fill={color}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              />
              <circle
                cx={x}
                cy={y}
                r="1.5"
                fill={color}
              />
            </g>
          );
        })}
      </svg>
      <div className="flex justify-between text-xs text-muted-foreground mt-2 px-1">
        <span>{minValue.toFixed(1)}</span>
        <span className="font-semibold">{label}</span>
        <span>{maxValue.toFixed(1)}</span>
      </div>
    </div>
  );
};

// Area chart component (filled line chart)
const SimpleAreaChart = ({ data, color, label }: { data: number[]; color: string; label: string }) => {
  const maxValue = Math.max(...data);
  const minValue = Math.min(...data);
  const range = maxValue - minValue || 1;

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((value - minValue) / range) * 70 - 10;
    return `${x},${y}`;
  }).join(" ");

  const areaPoints = `0,90 ${points} 100,90`;

  return (
    <div className="h-48 relative bg-muted/20 rounded-lg p-2">
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Grid lines */}
        <line x1="0" y1="25" x2="100" y2="25" stroke="currentColor" strokeOpacity="0.1" strokeWidth="0.5" />
        <line x1="0" y1="50" x2="100" y2="50" stroke="currentColor" strokeOpacity="0.1" strokeWidth="0.5" />
        <line x1="0" y1="75" x2="100" y2="75" stroke="currentColor" strokeOpacity="0.1" strokeWidth="0.5" />

        {/* Gradient fill */}
        <defs>
          <linearGradient id={`area-gradient-${label}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: color, stopOpacity: 0.4 }} />
            <stop offset="100%" style={{ stopColor: color, stopOpacity: 0.05 }} />
          </linearGradient>
        </defs>

        {/* Filled area */}
        <polygon
          fill={`url(#area-gradient-${label})`}
          points={areaPoints}
        />

        {/* Line on top */}
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          points={points}
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Interactive data points */}
        {data.map((value, index) => {
          const x = (index / (data.length - 1)) * 100;
          const y = 100 - ((value - minValue) / range) * 70 - 10;
          return (
            <g key={index}>
              <circle
                cx={x}
                cy={y}
                r="1.5"
                fill={color}
                className="transition-all hover:r-3"
              />
            </g>
          );
        })}
      </svg>
      <div className="flex justify-between text-xs text-muted-foreground mt-2 px-1">
        <span>{minValue.toFixed(1)}</span>
        <span className="font-semibold">{label}</span>
        <span>{maxValue.toFixed(1)}</span>
      </div>
    </div>
  );
};

export default function DevicePage() {
  const [deviceData, setDeviceData] = useState<DeviceData>(generateMockData());
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [isConnected, setIsConnected] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    // Initialize with some historical data
    const initialData: ChartDataPoint[] = Array.from({ length: 20 }, (_, i) => {
      const data = generateMockData();
      const time = new Date(Date.now() - (19 - i) * 4000);
      return {
        time: time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
        heartRate: data.heartRate,
        temperature: data.temperature,
        bloodOxygen: data.bloodOxygen,
        respiratoryRate: data.respiratoryRate,
      };
    });

    setChartData(initialData);

    // Update data every 4-5 seconds randomly
    const scheduleNextUpdate = () => {
      const randomDelay = 4000 + Math.random() * 1000;
      return setTimeout(() => {
        setDeviceData((prev) => {
          const newData = generateMockData(prev);
          setLastUpdate(new Date());

          setChartData((prevChart) => {
            const maxPoints = 20;
            const newPoint: ChartDataPoint = {
              time: newData.timestamp.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              }),
              heartRate: newData.heartRate,
              temperature: newData.temperature,
              bloodOxygen: newData.bloodOxygen,
              respiratoryRate: newData.respiratoryRate,
            };
            return [...prevChart.slice(-maxPoints + 1), newPoint];
          });

          return newData;
        });
        scheduleNextUpdate();
      }, randomDelay);
    };

    const timeout = scheduleNextUpdate();
    return () => clearTimeout(timeout);
  }, []);

  const getStatus = (value: number, min: number, max: number) => {
    if (value < min || value > max) return "text-destructive";
    return "text-green-500";
  };

  const getTrend = (current: number, data: ChartDataPoint[], key: keyof ChartDataPoint) => {
    if (data.length < 5) return "stable";
    const recent = data.slice(-3).map((d) => d[key] as number);
    const previous = data.slice(-6, -3).map((d) => d[key] as number);
    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const prevAvg = previous.reduce((a, b) => a + b, 0) / previous.length;

    if (recentAvg > prevAvg + 1) return "up";
    if (recentAvg < prevAvg - 1) return "down";
    return "stable";
  };

  const TrendIcon = ({ trend }: { trend: string }) => {
    if (trend === "up") return <TrendingUp className="w-4 h-4 text-red-500" />;
    if (trend === "down") return <TrendingDown className="w-4 h-4 text-green-500" />;
    return <Minus className="w-4 h-4 text-muted-foreground" />;
  };

  return (
    <div className="container max-w-7xl py-8 mx-auto px-4 min-h-screen">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Device Monitoring</h1>
              <p className="text-muted-foreground mt-1">Real-time health metrics from your wearable device</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${isConnected ? "bg-green-500 animate-pulse" : "bg-red-500"}`}
              />
              <span className="text-sm font-medium">
                {isConnected ? "Device Connected" : "Device Disconnected"}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              Last update: {lastUpdate.toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>

      {/* Main Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Heart Rate Card */}
        <Card className="p-6 hover:shadow-lg transition-all duration-300 border-l-4 border-l-red-500">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                <Heart className="w-5 h-5 text-red-500" />
              </div>
              <h3 className="font-semibold">Heart Rate</h3>
            </div>
            <TrendIcon trend={getTrend(deviceData.heartRate, chartData, "heartRate")} />
          </div>
          <div className="space-y-2">
            <div className={`text-4xl font-bold ${getStatus(deviceData.heartRate, 60, 100)}`}>
              {deviceData.heartRate.toFixed(0)}
            </div>
            <div className="text-sm text-muted-foreground">beats per minute</div>
            <div className="text-xs text-muted-foreground bg-muted/50 rounded px-2 py-1">
              Normal: 60-100 bpm
            </div>
          </div>
        </Card>

        {/* Temperature Card */}
        <Card className="p-6 hover:shadow-lg transition-all duration-300 border-l-4 border-l-orange-500">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center">
                <Thermometer className="w-5 h-5 text-orange-500" />
              </div>
              <h3 className="font-semibold">Temperature</h3>
            </div>
            <TrendIcon trend={getTrend(deviceData.temperature, chartData, "temperature")} />
          </div>
          <div className="space-y-2">
            <div className={`text-4xl font-bold ${getStatus(deviceData.temperature, 97.0, 99.5)}`}>
              {deviceData.temperature.toFixed(1)}°F
            </div>
            <div className="text-sm text-muted-foreground">body temperature</div>
            <div className="text-xs text-muted-foreground bg-muted/50 rounded px-2 py-1">
              Normal: 97.0-99.5°F
            </div>
          </div>
        </Card>

        {/* Blood Oxygen Card */}
        <Card className="p-6 hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Droplet className="w-5 h-5 text-blue-500" />
              </div>
              <h3 className="font-semibold">Blood Oxygen</h3>
            </div>
            <TrendIcon trend={getTrend(deviceData.bloodOxygen, chartData, "bloodOxygen")} />
          </div>
          <div className="space-y-2">
            <div className={`text-4xl font-bold ${getStatus(deviceData.bloodOxygen, 95, 100)}`}>
              {deviceData.bloodOxygen.toFixed(0)}%
            </div>
            <div className="text-sm text-muted-foreground">oxygen saturation (SpO2)</div>
            <div className="text-xs text-muted-foreground bg-muted/50 rounded px-2 py-1">
              Normal: 95-100%
            </div>
          </div>
        </Card>

        {/* Blood Pressure Card */}
        <Card className="p-6 hover:shadow-lg transition-all duration-300 border-l-4 border-l-purple-500">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                <Activity className="w-5 h-5 text-purple-500" />
              </div>
              <h3 className="font-semibold">Blood Pressure</h3>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-4xl font-bold">
              <span className={getStatus(deviceData.bloodPressureSystolic, 110, 130)}>
                {deviceData.bloodPressureSystolic.toFixed(0)}
              </span>
              <span className="text-muted-foreground text-2xl">/</span>
              <span className={getStatus(deviceData.bloodPressureDiastolic, 70, 90)}>
                {deviceData.bloodPressureDiastolic.toFixed(0)}
              </span>
            </div>
            <div className="text-sm text-muted-foreground">mmHg (systolic/diastolic)</div>
            <div className="text-xs text-muted-foreground bg-muted/50 rounded px-2 py-1">
              Normal: 120/80 mmHg
            </div>
          </div>
        </Card>
      </div>

      {/* Secondary Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center">
              <Wind className="w-5 h-5 text-cyan-500" />
            </div>
            <h3 className="font-semibold">Respiratory Rate</h3>
          </div>
          <div className="space-y-2">
            <div className={`text-3xl font-bold ${getStatus(deviceData.respiratoryRate, 12, 20)}`}>
              {deviceData.respiratoryRate.toFixed(0)}
            </div>
            <div className="text-sm text-muted-foreground">breaths per minute</div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
              <Activity className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="font-semibold">Steps Today</h3>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-green-500">{deviceData.steps.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">total steps</div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center">
              <Zap className="w-5 h-5 text-yellow-500" />
            </div>
            <h3 className="font-semibold">Calories Burned</h3>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-yellow-600">{deviceData.calories.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">kcal burned</div>
          </div>
        </Card>
      </div>

      {/* Data Visualization Section */}
      <div className="space-y-6 mb-8">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Activity className="w-6 h-6" />
          Real-Time Data Visualizations
        </h2>

        {/* Heart Rate Chart - Bar Chart */}
        <Card className="p-6 hover:shadow-xl transition-all duration-300 border-red-500/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                <Heart className="w-5 h-5 text-red-500" />
              </div>
              Heart Rate Trend
            </h3>
            <Badge variant="outline" className="text-xs">Bar Chart</Badge>
          </div>
          <SimpleBarChart
            data={chartData.map((d) => d.heartRate)}
            color="bg-gradient-to-t from-red-500 to-red-300"
            label="bpm"
          />
          <div className="mt-4 flex justify-between items-center">
            <div className="text-xs text-muted-foreground">Last 80 seconds</div>
            <div className="text-xs font-semibold text-red-500">
              Current: {deviceData.heartRate.toFixed(0)} bpm
            </div>
          </div>
        </Card>

        {/* Temperature Chart - Line Chart */}
        <Card className="p-6 hover:shadow-xl transition-all duration-300 border-orange-500/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center">
                <Thermometer className="w-5 h-5 text-orange-500" />
              </div>
              Temperature Monitoring
            </h3>
            <Badge variant="outline" className="text-xs">Line Chart</Badge>
          </div>
          <SimpleLineChart
            data={chartData.map((d) => d.temperature)}
            color="#f97316"
            label="°F"
          />
          <div className="mt-4 flex justify-between items-center">
            <div className="text-xs text-muted-foreground">Last 80 seconds</div>
            <div className="text-xs font-semibold text-orange-500">
              Current: {deviceData.temperature.toFixed(1)}°F
            </div>
          </div>
        </Card>

        {/* Blood Oxygen Chart - Area Chart */}
        <Card className="p-6 hover:shadow-xl transition-all duration-300 border-blue-500/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Droplet className="w-5 h-5 text-blue-500" />
              </div>
              Blood Oxygen (SpO2) Trend
            </h3>
            <Badge variant="outline" className="text-xs">Area Chart</Badge>
          </div>
          <SimpleAreaChart
            data={chartData.map((d) => d.bloodOxygen)}
            color="#3b82f6"
            label="%"
          />
          <div className="mt-4 flex justify-between items-center">
            <div className="text-xs text-muted-foreground">Last 80 seconds</div>
            <div className="text-xs font-semibold text-blue-500">
              Current: {deviceData.bloodOxygen.toFixed(1)}%
            </div>
          </div>
        </Card>
      </div>

      {/* Raw Data Stream Section */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4 text-lg flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Raw Data Stream
        </h3>
        <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm overflow-x-auto border border-border">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-1">
              <span className="text-muted-foreground text-xs uppercase">Heart Rate</span>
              <div className="text-lg font-bold text-red-500">{deviceData.heartRate.toFixed(2)} bpm</div>
            </div>
            <div className="space-y-1">
              <span className="text-muted-foreground text-xs uppercase">Temperature</span>
              <div className="text-lg font-bold text-orange-500">{deviceData.temperature.toFixed(2)}°F</div>
            </div>
            <div className="space-y-1">
              <span className="text-muted-foreground text-xs uppercase">Blood Oxygen</span>
              <div className="text-lg font-bold text-blue-500">{deviceData.bloodOxygen.toFixed(2)}%</div>
            </div>
            <div className="space-y-1">
              <span className="text-muted-foreground text-xs uppercase">BP Systolic</span>
              <div className="text-lg font-bold text-purple-500">
                {deviceData.bloodPressureSystolic.toFixed(2)} mmHg
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-muted-foreground text-xs uppercase">BP Diastolic</span>
              <div className="text-lg font-bold text-purple-500">
                {deviceData.bloodPressureDiastolic.toFixed(2)} mmHg
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-muted-foreground text-xs uppercase">Respiratory Rate</span>
              <div className="text-lg font-bold text-cyan-500">{deviceData.respiratoryRate.toFixed(2)} br/min</div>
            </div>
            <div className="space-y-1">
              <span className="text-muted-foreground text-xs uppercase">Steps</span>
              <div className="text-lg font-bold text-green-500">{deviceData.steps.toLocaleString()}</div>
            </div>
            <div className="space-y-1">
              <span className="text-muted-foreground text-xs uppercase">Calories</span>
              <div className="text-lg font-bold text-yellow-600">{deviceData.calories.toLocaleString()} kcal</div>
            </div>
            <div className="space-y-1">
              <span className="text-muted-foreground text-xs uppercase">Timestamp</span>
              <div className="text-lg font-bold">{deviceData.timestamp.toLocaleTimeString()}</div>
            </div>
          </div>
        </div>
        <div className="mt-4 text-xs text-muted-foreground text-center bg-muted/30 rounded-lg py-2">
          Auto-updates every 4-5 seconds with live sensor data
        </div>
      </Card>
    </div>
  );
}
