import { useEffect, useState } from "react";
import { Text, View, Image, StyleSheet, Button } from "react-native";

export default function BadgerBakedGood(props) {

    return <View>
        <View
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}>
            <Image
                style={{
                    width: 200,
                    height: 200,
                }}
                source={{
                    uri: props.good.imgSrc,
                }}
            />
            <Text
                style={{
                    fontSize: 24,
                    fontWeight: 500,
                }}>
                {props.good.name}
            </Text>
            <Text
                style={{
                    marginTop: 12,
                }}>
                ${props.good.price}
            </Text>
            <Text>
                You can order {props.good.upperLimit === -1 ? 'unlimited' : `up to ${props.good.upperLimit}`} units!
            </Text>
        </View>
    </View>
}
