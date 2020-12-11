import React, { useState, useEffect } from "react";

import Header from "../../components/Header";

import api from "../../services/api";

import Food from "../../components/Food";
import ModalAddFood from "../../components/ModalAddFood";
import ModalEditFood from "../../components/ModalEditFood";

import { FoodsContainer } from "./styles";

interface IFoodPlate {
  id: number;
  name: string;
  image: string;
  price: string;
  description: string;
  available: boolean;
}

const Dashboard: React.FC = () => {
  const [foods, setFoods] = useState<IFoodPlate[]>([]);
  const [editingFood, setEditingFood] = useState<IFoodPlate>({} as IFoodPlate);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    async function loadFoods(): Promise<void> {
      let response = await api.get("/foods");
      setFoods(response.data);
    }

    loadFoods();
  }, [setFoods]);

  async function handleAddFood(
    food: Omit<IFoodPlate, "id" | "available">
  ): Promise<void> {
    try {
      let id = foods.length + 1;
      let available = true;

      //Object.assign(food,{...food,id,available})
      let newFood = { ...food, id, available };

      let response = await api.post("/foods", newFood);
      let newFoods = foods;
      newFoods = newFoods.concat(response.data);

      setFoods(newFoods);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleUpdateFood(
    food: Omit<IFoodPlate, "id" | "available">
  ): Promise<void> {
    try{

      let {id,available} = editingFood
      let updatedFood = {...food,id,available}
      let response = await api.put(`/foods/${id}`, updatedFood);
      let newFoods = foods.map(food =>{
        if(food.id === response.data.id)
          return response.data
        return food
      });
      
      setFoods(newFoods);
    }catch (err) {
      console.log(err);
    }
  }

  async function handleDeleteFood(id: number): Promise<void> {
    // TODO DELETE A FOOD PLATE FROM THE API

    try {
      let response = await api.delete(`/foods/${id}`);
      setFoods(response.data);
    } catch (Exception) {
      console.log(`Error: ${Exception}`);
    }
  }

  function toggleModal(): void {
    setModalOpen(!modalOpen);
  }

  function toggleEditModal(): void {
    setEditModalOpen(!editModalOpen);
  }

  function handleEditFood(food: IFoodPlate): void {
    setEditingFood(food);
    toggleEditModal();
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map((food) => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
};

export default Dashboard;
