import { Menu, MenuButton, MenuList, Select } from "@chakra-ui/react";
import { Accordion, AccordionItem, Button } from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import "../AllProduct.css";

interface ProMenueProps {
  setPrice: (price: any) => void;
  setSortOption: (sortOption: string) => void;
}

export default function PorMenue(props: ProMenueProps): JSX.Element {
  const { setPrice, setSortOption } = props;

  return (
    <div className="Prod_menu" style={{ margin: "0.7rem" }}>
      <Menu>
        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
          Filter
        </MenuButton>
        <MenuList>
          <Accordion allowToggle>
            <AccordionItem>
              <Select
                placeholder="Price Range"
                onChange={(e) => {
                  setPrice(e.target.value.split(':').map(Number));
                }}
                textAlign="center"
              >
                <option value="0:10">Under $10</option>
                <option value="0:20">Under $20</option>
                <option value="0:50">Under $50</option>
                <option value="0:100">Under $100</option>
                <option value="0:200">Under $200</option>
              </Select>
            </AccordionItem>
            <AccordionItem>
              <Select
                placeholder="Sort By"
                textAlign="center"
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="popular">Most Popular</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
              </Select>
            </AccordionItem>
          </Accordion>
        </MenuList>
      </Menu>
    </div>
  );
}
