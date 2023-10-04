import Histogram from '@/components/Histogram';
import MockData from '../MOCK_DATA.json';

export default function Home() {
	const data = MockData;
	return (
		<>
			<Histogram data={data} />
		</>
	);
}
