import { Label, TextInput } from 'flowbite-react';

const SearchForPharmacies: React.FC = () => {
  return (
    <form className="mb-4 sm:mb-0 sm:pr-3" action="#" method="GET">
      <Label htmlFor="products-search" className="sr-only">
        Search
      </Label>
      <div className="relative mt-1 lg:w-64 xl:w-96">
        <TextInput
          id="products-search"
          name="products-search"
          placeholder="Search for pharmacies"
        />
      </div>
    </form>
  );
};
export default SearchForPharmacies;
