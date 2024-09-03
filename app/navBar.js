import {View, Text, Image, TouchableOpacity} from 'react-native'
import React, { useState } from 'react'
import Model from 'react-native-modal'
import {FlatList} from 'react-native-gesture-handler'

const [navBarVisible, setNavBarVisible] = useState(true);

const NavBar = () => {
	return (
		<View style={
			{flex: 1}
		}>
			<Model isVisible animationIn={'slideInLeft'} animationOut={'slideOutLeft'}
				backdropOpacity={.5}>
				<View style={
					{
						width: '80%',
						height: '95%',
						// backgroundColor: 'green',
						justifyContent: 'center',
						alignItems: 'center'
					}
				}>
					<View style={
						{
							width: '80%',
							height: '95%',
							backgroundColor: 'white',
							borderRadius: 20
						}
					}>
						<View style={
							{marginTop: 250}
						}>
							<FlatList data={
									[
										{
											title: 'Orders',
											icon: require('../assets/icon.png')
										}, {
											title: 'Notification',
											icon: require('../assets/icon.png')
										}, {
											title: 'Setting',
											icon: require('../assets/icon.png')
										}
									]
								}
								renderItem={
									({item, index}) => {
										return (
											<TouchableOpacity style={
												{
													width: '90%',
													height: 50,
													alignSelf: 'center',
													borderBottomWidth: .4,
													borderBottomColor: 'grey',
													marginTop: 10,
													flexDirection: 'row'
												}
											}>
												<Image source={item.icon} style={{width:24, height:24}}/>
												<Text style={{marginLeft: 15, fontSize:18}}>{item.title}</Text>
											</TouchableOpacity>
										);
									}
								}/>
						</View>
				</View>
				<View style={
					{
						width: '100%',
						height: 120,
						position: 'absolute',
						top: 100


					}
				}>
					<View style={
						{
							backgroundColor: '#ffe5b0',
							borderTopLeftRadius: 20,
							borderTopRightRadius: 20,
							borderWidth: 2,
							height: 100,
							width: '100%',
							borderColor: 'orange',
							flexDirection: 'row',
							alignItems: 'center',
							paddingLeft: 20,
							paddingRight: 10,
							justifyContent: 'space-between'
						}
					}>
						<View style={
							{
								flexDirection: 'row',
								alignItems: 'center'
							}
						}>
							<Image source={
									require('../assets/icon.png')
								}
								style={
									{
										width: 50,
										height: 50,
										borderRadius: 25
									}
							}></Image>
							<View style={
								{marginLeft: 20}
							}>
								<Text style={
									{
										fontSize: 18,
										fontWeight: '600',
										color: 'black'
									}
								}>User Name</Text>
								<Text style={
									{
										fontSize: 18,
										fontWeight: '600',
										color: 'black'
									}
								}>Phone Number</Text>
							</View>

						</View>
						<Image source={
								require('../assets/right_arrow.png')
							}
							style={
								{
									width: 24,
									height: 24
								}
						}></Image>
					</View>
					<View style={
						{
							width: '100%',
							justifyContent: 'space-between',
							flexDirection: 'row',
							alignItems: 'center',
							marginTop: -3
						}
					}>
						<View style={
							{
								width: 0,
								height: 0,
								borderLeftWidth: 22,
								borderRightWidth: 22,
								borderBottomWidth: 22,
								borderLeftColor: 'transparent',
								borderRightColor: 'transparent',
								borderBottomColor: 'orange',
								transform: [
									{
										rotate: '45deg'
									}
								]
							}
						}></View>
						<View style={
							{
								width: 0,
								height: 0,
								borderLeftWidth: 22,
								borderRightWidth: 22,
								borderBottomWidth: 22,
								borderLeftColor: 'transparent',
								borderRightColor: 'transparent',
								borderBottomColor: 'orange',
								transform: [
									{
										rotate: '-45deg'
									}
								]
							}
						}></View>
					</View>
				</View>
			</View>


		</Model>
	</View>
	)
}

export default NavBar
