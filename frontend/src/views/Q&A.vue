<script setup lang="ts">
import { ref } from "vue";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = ref([
  {
    id: 1,
    question: "Como funciona o sistema de carrinho abandonado?",
    answer:
      "O sistema monitora carrinhos que foram iniciados mas não finalizados pelos clientes, permitindo recuperar vendas perdidas através de estratégias de remarketing.",
  },
  {
    id: 2,
    question: "Quais dados são coletados dos carrinhos abandonados?",
    answer:
      "Coletamos informações como dados do cliente, produtos no carrinho, valor total, data/hora do abandono e status da transação.",
  },
  {
    id: 3,
    question: "Como posso recuperar um carrinho abandonado?",
    answer:
      "Você pode enviar emails personalizados, ofertas especiais ou entrar em contato direto com o cliente para incentivar a finalização da compra.",
  },
  {
    id: 4,
    question: "O sistema é integrado com qual plataforma de e-commerce?",
    answer:
      "O sistema é compatível com as principais plataformas do mercado e pode ser customizado para integrações específicas.",
  },
  {
    id: 5,
    question: "Quais são as melhores práticas para recuperar carrinhos?",
    answer:
      "As melhores práticas incluem: enviar emails personalizados, oferecer descontos, simplificar o processo de checkout e usar remarketing direcionado.",
  },
  {
    id: 6,
    question: "Como o sistema calcula a taxa de recuperação?",
    answer:
      "A taxa de recuperação é calculada dividindo o número de carrinhos recuperados pelo total de carrinhos abandonados, multiplicado por 100.",
  },
]);
</script>

<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-3xl font-bold">Perguntas e Respostas</h1>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>FAQ - Perguntas Frequentes</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible class="w-full">
          <AccordionItem
            v-for="faq in faqs"
            :key="faq.id"
            :value="`item-${faq.id}`"
          >
            <AccordionTrigger class="text-left">
              {{ faq.question }}
            </AccordionTrigger>
            <AccordionContent class="text-gray-600 leading-relaxed">
              {{ faq.answer }}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Precisa de mais ajuda?</CardTitle>
      </CardHeader>
      <CardContent>
        <p class="text-gray-600 mb-4">
          Se você não encontrou a resposta que procurava, entre em contato
          conosco.
        </p>
        <Button class="bg-blue-600 hover:bg-blue-700">
          Entrar em Contato
        </Button>
      </CardContent>
    </Card>
  </div>
</template>

<style scoped lang="scss"></style>
