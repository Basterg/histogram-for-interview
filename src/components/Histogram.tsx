import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import styles from './Histogram.module.scss';

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

const Histogram: React.FC = () => {
	const chartRef = useRef<HTMLCanvasElement | null>(null);
	const chartInstance = useRef<Chart | null>(null);
	const [selectedPeriod, setSelectedPeriod] = useState<'year' | 'half_year'>(
		'year'
	);

	useEffect(() => {
		const monthsCount = selectedPeriod === 'year' ? 12 : 6;
		const labels = Array.from({ length: monthsCount }, (_, index) => {
			const monthIndex = index;
			return monthNames[monthIndex];
		});

		const data = Array.from({ length: monthsCount }, () =>
			Math.floor(Math.random() * 2000)
		);

		if (chartRef.current) {
			const ctx = chartRef.current.getContext('2d');
			if (ctx) {
				if (chartInstance.current) {
					chartInstance.current.destroy();
				}
				chartInstance.current = new Chart(ctx, {
					type: 'bar',
					data: {
						labels: labels,
						datasets: [
							{
								label: 'Earnings',
								data: data,
								backgroundColor: 'rgba(0, 10, 255, 1)',
								borderWidth: 1
							}
						]
					},
					options: {
						scales: {
							y: {
								beginAtZero: true
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
	}, [selectedPeriod]);

	return (
		<div className={styles.chartContainer}>
			<div className={styles.selector}>
				<label>Выбрать период: </label>
				<select
					value={selectedPeriod}
					onChange={e =>
						setSelectedPeriod(e.target.value as 'year' | 'half_year')
					}
				>
					<option value='year'>За последний год</option>
					<option value='half_year'>За последние 6 месяцев</option>
				</select>
			</div>
			<canvas ref={chartRef}></canvas>
		</div>
	);
};

export default Histogram;
