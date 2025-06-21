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
    multiple?: boolean; // Whether to allow multiple selections
}

const CountrySelector: React.FC<CountrySelectProps> = ({ control, name, multiple }) => {
    const [countries, setCountries] = useState<CountryOption[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    // Fetching countries list (static or API-based)
    useEffect(() => {
        setLoading(true);
        fetch('https://restcountries.com/v3.1/all?fields=name') // new update forces use of fields query
            .then(response => response.json())
            .then(data => {
                const countryOptions = data?.map((country: any) => ({
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
                    <FormLabel className={multiple ? "text-primary" : ""}>{multiple ? "Countries" : "Country"}</FormLabel>
                    <FormControl>
                        {loading ? (
                            <div className="font-retro">Loading...</div>
                        ) : (
                            <Select
                                isMulti={multiple ?? false}
                                {...field}
                                options={countries}
                                placeholder={"Search and select " + (multiple ? "target countries" : "your country")}
                                isSearchable
                                getOptionLabel={(e) => e.label} // This ensures the label is shown in the dropdown
                                getOptionValue={(e) => e.value} // This ensures the value is set correctly when selected
                                value={countries.filter(country => field.value?.includes(country.value) ?? country.value === field.value)}
                                onChange={(selectedOption) => {
                                    if (Array.isArray(selectedOption)) {
                                        // Handle multi-select: return an array of values
                                        field.onChange(selectedOption.map(option => option.value));
                                    } else if (selectedOption) {
                                        // Handle single-select: return just the value
                                        field.onChange(selectedOption.value);
                                    } else {
                                        // In case nothing is selected, pass undefined
                                        field.onChange(undefined);
                                    }
                                }}
                                className="text-green font-retro"
                                styles={{
                                    control: (provided, state) => ({
                                        ...provided,
                                        background: "hsl(var(--background))",
                                        borderColor: "hsl(var(--border))",
                                        boxShadow: state.isFocused ? "0 0 0 1px hsl(var(--ring))" : "none",
                                        "&:hover": {
                                            borderColor: "hsl(var(--ring))"
                                        }

                                    }),
                                    menu: (provided) => ({
                                        ...provided,
                                        background: "hsl(var(--background))",
                                    }),
                                    option: (provided, state) => ({
                                        ...provided,
                                        backgroundColor: state.isSelected || state.isFocused ? "hsl(var(--muted))" : "hsl(var(--background))",
                                        color: "hsl(var(--foreground))",
                                        ":active": {
                                            backgroundColor: "hsl(var(--accent))",
                                            color: "hsl(var(--green))"
                                        },
                                    }),
                                    singleValue: (provided) => ({
                                        ...provided,
                                        color: "hsl(var(--foreground))"
                                    }),
                                    multiValue: (provided) => ({
                                        ...provided,
                                        backgroundColor: "hsl(var(--muted))",
                                        color: "hsl(var(--foreground))"
                                    }),
                                    multiValueLabel: (provided) => ({
                                        ...provided,
                                        color: "hsl(var(--foreground))"
                                    }),
                                    multiValueRemove: (provided) => ({
                                        ...provided,
                                        color: "hsl(var(--destructive))"
                                    }),
                                    input: (provided) => ({
                                        ...provided,
                                        color: "hsl(var(--muted-foreground))",
                                    }),
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