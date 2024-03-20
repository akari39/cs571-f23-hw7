import { Alert, Button, Text, View } from "react-native";
import BadgerBakedGood from "./BadgerBakedGood";
import { useEffect, useState } from "react";
import CS571 from '@cs571/mobile-client';

export default function BadgerBakery() {
    const [goods, setGoods] = useState({});
    const [basket, setBasket] = useState({});
    const [index, setIndex] = useState(0);
    const [orderTotal, setOrderTotal] = useState(0.00);

    async function fetchGoods() {
        const goods = await fetch("https://cs571.org/api/f23/hw7/goods", {
            headers: {
                "X-CS571-ID": CS571.getBadgerId(),
            }
        })
            .then(async res => {
                const json = await res.json();
                if (res.status === 200) {
                    return json;
                }
                throw new Error(json.msg);
            })
            .catch(err => {
                alert(err.message);
            });
        if (goods === undefined || goods === null) {
            setGoods([]);
            return;
        }
        setGoods(goods);
    }

    useEffect(() => fetchGoods(), []);

    useEffect(() => {
        calculatetotalPrice();
    }, [basket]);

    function onPrevious() {
        setIndex(index - 1);
    }

    function onNext() {
        setIndex(index + 1);
    }

    function onGoodChange(key, unit) {
        var newBasket = JSON.parse(JSON.stringify(basket));
        if (unit === 0) {
            delete newBasket[key];
            setBasket(newBasket);
            return;
        }
        newBasket[key] = unit;
        setBasket(newBasket);
    }

    function calculatetotalPrice() {
        var totalPrice = 0;
        for (let [key, value] of Object.entries(basket)) {
            totalPrice += value * goods[key].price;
        }
        setOrderTotal(totalPrice);
    }

    const goodsKeys = Object.keys(goods);
    if (goodsKeys.length === 0) {
        return <></>;
    }
    const currentKey = goodsKeys[index];
    const currentUnit = basket[currentKey] ?? 0;
    const currentGood = goods[currentKey];

    function submit() {
        var itemCount = 0;
        for (let [key, value] of Object.entries(basket)) {
            itemCount += value;
        }
        Alert.alert("Order Confirmed!", `Your order contains ${itemCount} items and would have cost $${orderTotal.toFixed(2)}!`);
    }

    return <View>
        <Text style={{
            fontWeight: 500,
        }}>Welcome to Badger Bakery!</Text>
        <View style={{
            marginTop: 10,
            marginBottom: 20,
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
        }}>
            <Button disabled={index <= 0} onPress={onPrevious} title="Previous" />
            <View style={{ width: 4 }} />
            <Button disabled={index >= goodsKeys.length - 1} onPress={onNext} title="Next" />
        </View>
        {
            <BadgerBakedGood
                good={currentGood}
            />
        }
        <Text style={{
            marginTop: 12,
        }}>
            Order Total: ${orderTotal.toFixed(2)}
        </Text>
        <View style={{
            marginTop: 12,
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
        }}>
            <Button
                title="-"
                disabled={currentUnit <= 0}
                onPress={() => onGoodChange(currentKey, currentUnit - 1)} />
            <Text style={{
                marginLeft: 8,
                marginRight: 8,
            }}>
                {currentUnit ?? 0}
            </Text>
            <Button
                title="+"
                disabled={currentGood.upperLimit !== -1 && currentUnit >= currentGood.upperLimit}
                onPress={() => onGoodChange(currentKey, currentUnit + 1)} />
        </View>
        <View style={{
            marginTop: 12,
        }}>
            <Button
                title="Place Order"
                disabled={Object.keys(basket).length === 0}
                onPress={submit} />
        </View>
    </View>
}
