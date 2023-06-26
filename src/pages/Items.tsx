import Card from "../components/Card";
import { itemCards } from "../data";
import "./Items.css";

function Items() {
  {
    return (
      <>
        <div className="items-container">
          {itemCards.map((item) => {
            return <Card key={item.id} {...item} />;
          })}
        </div>
      </>
    );
  }
}

export default Items;
