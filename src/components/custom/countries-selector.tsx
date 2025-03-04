import { useState, useEffect } from 'react';
import Select from 'react-select'; // Import react-select for searchable dropdown
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/src/components/ui/form';

// Define the type for country options
interface CountryOption {
    value: string;
    label: string;
}
interface CountrySelectProps {
    control: any; // The control from react-hook-form
    name: string; // The name of the field to bind the input
}

const CountrySelector: React.FC<CountrySelectProps> = ({ control, name }) => {
    const [countries, setCountries] = useState<CountryOption[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    // Fetching countries list (static or API-based)
    useEffect(() => {
        setLoading(true);
        fetch('https://restcountries.com/v3.1/all')
            .then(response => response.json())
            .then(data => {
                const countryOptions = data.map((country: any) => ({
                    value: country.name.common,
                    label: country.name.common,
                }));
                setCountries(countryOptions);
            })
            .catch(err => {
                console.error('Error fetching countries:', err);
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                        {loading ? (
                            <div>Loading...</div> // Replace with a loading spinner if desired
                        ) : (
                            <Select
                                {...field}
                                options={countries}
                                placeholder="Search and select your country"
                                isSearchable
                                getOptionLabel={(e) => e.label} // This ensures the label is shown in the dropdown
                                getOptionValue={(e) => e.value} // This ensures the value is set correctly when selected
                                value={countries.find(country => country.value === field.value)}
                                onChange={(selectedOption) => {
                                    field.onChange(selectedOption ? selectedOption.value : undefined); // Get the value only, not the whole object
                                }}
                                className="text-green"
                                styles={{
                                    control: (provided) => ({
                                        ...provided,
                                        background: "hsl(var(--background))",
                                        borderColor: "hsl(var(--border))",

                                    }),
                                    menu: (provided) => ({
                                        ...provided,
                                        background: "hsl(var(--background))",
                                    }),
                                    option: (provided, state) => ({
                                        ...provided,
                                        backgroundColor: state.isSelected ? "hsl(var(--muted))" : state.isFocused ? "hsl(var(--muted))" : "hsl(var(--background))",
                                        color: "hsl(var(--foreground))",
                                    }),
                                    singleValue: (provided) => ({
                                        ...provided,
                                        color: "hsl(var(--foreground))"
                                    })
                                }}
                            />
                        )}
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};

export default CountrySelector;