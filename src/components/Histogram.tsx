import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Chart, TooltipItem } from 'chart.js/auto';
import styles from './Histogram.module.scss';

interface PeriodData {
	graph: {
		year: { [key: string]: number | null };
		half_year: { [key: string]: number | null };
		month: { [key: string]: number | null };
	};
}

interface FinanceData {
	periods: PeriodData[];
}

interface Props {
	data: {
		finance: FinanceData;
	};
}

const monthNames = [
	'Январь',
	'Февраль',
	'Март',
	'Апрель',
	'Май',
	'Июнь',
	'Июль',
	'Август',
	'Сентябрь',
	'Октябрь',
	'Ноябрь',
	'Декабрь'
];

const Histogram: React.FC<Props> = ({ data }) => {
	const chartRef = useRef<HTMLCanvasElement | null>(null);
	const chartInstance = useRef<Chart | null>(null);
	const [selectedPeriod, setSelectedPeriod] = useState<
		'year' | 'half_year' | 'month'
	>('year');
	const dataForChart = useRef<number[]>([]);

	const updateDataForChart = useCallback(() => {
		if (
			data.finance &&
			data.finance.periods &&
			data.finance.periods.length > 0
		) {
			let selectedData: { [key: string]: number | null } = {};

			if (selectedPeriod === 'year') {
				selectedData = data.finance.periods[0].graph.year;
			} else if (selectedPeriod === 'half_year') {
				selectedData = data.finance.periods[0].graph.half_year;
			} else if (selectedPeriod === 'month') {
				selectedData = data.finance.periods[0].graph.month;
			}

			const daysInMonth = Object.values(selectedData).map(value => value || 0);
			dataForChart.current = daysInMonth;
		} else {
			dataForChart.current = [];
		}
	}, [selectedPeriod, data.finance]);

	const xAxisLabels = function generateXAxisLabels(
		selectedPeriod: string
	): (string | number)[] {
		let xAxisLabels: (string | number)[] = [];

		if (selectedPeriod === 'year' || selectedPeriod === 'half_year') {
			xAxisLabels = monthNames.slice(0, dataForChart.current.length);
		} else if (selectedPeriod === 'month') {
			xAxisLabels = Array.from({ length: 31 }, (_, index) => index + 1);
		}

		return xAxisLabels;
	};

	useEffect(() => {
		updateDataForChart();

		if (chartRef.current) {
			const ctx = chartRef.current.getContext('2d');
			if (ctx) {
				if (chartInstance.current) {
					chartInstance.current.destroy();
				}

				chartInstance.current = new Chart(ctx, {
					type: 'bar',
					data: {
						labels: xAxisLabels(selectedPeriod),
						datasets: [
							{
								label: 'Earnings',
								data: dataForChart.current,
								backgroundColor: 'rgba(0, 10, 255, 1)',
								borderColor: 'rgba(54, 162, 235, 1)',
								borderWidth: 1,
								borderRadius: 10,
								barThickness: 20
							}
						]
					},
					options: {
						scales: {
							x: {
								grid: {
									display: false
								}
							},
							y: {
								beginAtZero: true,
								grid: {
									display: false
								}
							}
						},
						plugins: {
							legend: {
								display: false,
								position: 'top'
							},
							tooltip: {
								enabled: true,
								mode: 'index',
								position: 'nearest',
								intersect: false,
								displayColors: false,

								callbacks: {
									title: function () {
										return '';
									},
									label: function (context: TooltipItem<'bar'>) {
										return context.parsed.y.toString();
									}
								},
								backgroundColor: '#65ff8e',
								bodyColor: '#000000'
							}
						},

						layout: {
							padding: {
								left: 20,
								right: 20,
								top: 20,
								bottom: 20
							}
						}
					}
				});
			}
		}

		return () => {
			if (chartInstance.current) {
				chartInstance.current.destroy();
			}
		};
	}, [updateDataForChart, selectedPeriod]);

	return (
		<div className={styles.chartContainer}>
			<div className={styles.selector}>
				<select
					value={selectedPeriod}
					onChange={e =>
						setSelectedPeriod(e.target.value as 'year' | 'half_year' | 'month')
					}
				>
					<option value='year'>За последний год</option>
					<option value='half_year'>За последние 6 месяцев</option>
					<option value='month'>За последний месяц</option>
				</select>
			</div>
			<canvas ref={chartRef} className={styles.chart}></canvas>
		</div>
	);
};

export default Histogram;
