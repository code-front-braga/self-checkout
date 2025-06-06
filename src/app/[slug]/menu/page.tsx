import { db } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { RestaurantHeader } from './components/header';
import { RestaurantCategories } from './components/categories';

interface RestaurantMenuPageProps {
	params: Promise<{ slug: string }>;
	searchParams: Promise<{ consumptionMethod: string }>;
}

function isConsumptionMethodValid(consumptionMethod: string) {
	return ['DINE_IN', 'TAKEAWAY'].includes(consumptionMethod.toUpperCase());
}

export default async function RestaurantMenuPage({
	params,
	searchParams,
}: RestaurantMenuPageProps) {
	const { slug } = await params;
	const { consumptionMethod } = await searchParams;
	if (!isConsumptionMethodValid(consumptionMethod)) {
		return notFound();
	}

	const restaurant = await db.restaurant.findUnique({
		where: { slug },
		include: { menuCategories: { include: { products: true } } },
	});
	if (!restaurant) {
		return notFound();
	}

	return (
		<div>
			<RestaurantHeader restaurant={restaurant} />
			<RestaurantCategories restaurant={restaurant} />
		</div>
	);
}
