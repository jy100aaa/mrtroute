import findRoutes from './findRoutes';
import { stations } from './mrt.json';

it('should go from origin to destination', () => {
	const results = findRoutes({ lat: 1.322522, lng: 103.815403 }, { lat: 1.29321, lng: 103.852216 });
	const steps = results[0].steps;
	expect(steps[0].from).toBe('origin');
	expect(steps[steps.length - 1].to).toBe('destination');
});

it('route test Zopim to Farrer Park :)', () => {
	// nearest station from Zopim is CommonWealth station.
	// CommonWealth to Farrer Park
    const results = findRoutes(
		{
			lat: stations['commonwealth'].lat,
			lng: stations['commonwealth'].lng
        },
		{
			lat: stations['farrer_park'].lat,
			lng: stations['farrer_park'].lng
		}
	);
    const steps = results[0].steps;

    expect(steps[1].line).toBe('EW');
    expect(steps[1].from).toBe('Commonwealth');
    expect(steps[1].to).toBe('Buona Vista');
    expect(steps[1].stops).toBe(1);

    expect(steps[2].type).toBe('change');
    expect(steps[2].from + ' -> ' + steps[2].to).toBe('EW -> CC');

    expect(steps[3].line).toBe('CC');
    expect(steps[3].from).toBe('Buona Vista');
    expect(steps[3].to).toBe('Botanic Gardens');
    expect(steps[3].stops).toBe(3);

    expect(steps[4].type).toBe('change');
    expect(steps[4].from + ' -> ' + steps[4].to).toBe('CC -> DT');

    expect(steps[5].line).toBe('DT');
    expect(steps[5].from).toBe('Botanic Gardens');
    expect(steps[5].to).toBe('Little India');
    expect(steps[5].stops).toBe(3);

    expect(steps[6].type).toBe('change');
    expect(steps[6].from + ' -> ' + steps[6].to).toBe('DT -> NE');

    expect(steps[7].line).toBe('NE');
    expect(steps[7].from).toBe('Little India');
    expect(steps[7].to).toBe('Farrer Park');
    expect(steps[7].stops).toBe(1);
});
