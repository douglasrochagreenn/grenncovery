import { createInjectionState } from "@vueuse/core";
import emblaCarouselVue from "embla-carousel-vue";
import { onMounted, ref } from "vue";
import type { UnwrapRefCarouselApi as CarouselApi, CarouselEmits, CarouselProps } from "./interface";

const [useProvideCarousel, useInjectCarousel] = createInjectionState(
  ({ opts, orientation, plugins }: CarouselProps, emits: CarouselEmits) => {
    const [emblaNode, emblaApi] = emblaCarouselVue(
      {
        ...opts,
        axis: orientation === "horizontal" ? "x" : "y",
      },
      plugins
    );

    function scrollPrev() {
      const totalCount = emblaApi.value?.scrollSnapList().length;
      const current = emblaApi.value?.selectedScrollSnap();
      if (totalCount && current === 0) {
        emblaApi.value?.scrollTo(totalCount, false);
      } else {
        emblaApi.value?.scrollPrev();
      }
    }
    function scrollNext() {
      const totalCount = emblaApi.value?.scrollSnapList().length;
      const current = emblaApi.value?.selectedScrollSnap();
      if (totalCount && current && totalCount === current + 1) {
        emblaApi.value?.scrollTo(0, false);
      } else {
        emblaApi.value?.scrollNext();
      }
    }

    const canScrollNext = ref(false);
    const canScrollPrev = ref(false);

    function onSelect(api: CarouselApi) {
      canScrollNext.value = api?.canScrollNext() || false;
      canScrollPrev.value = api?.canScrollPrev() || false;
    }

    onMounted(() => {
      if (!emblaApi.value) return;

      emblaApi.value?.on("init", onSelect);
      emblaApi.value?.on("reInit", onSelect);
      emblaApi.value?.on("select", onSelect);

      emits("init-api", emblaApi.value);
    });

    return {
      carouselRef: emblaNode,
      carouselApi: emblaApi,
      canScrollPrev,
      canScrollNext,
      scrollPrev,
      scrollNext,
      orientation,
    };
  }
);

function useCarousel() {
  const carouselState = useInjectCarousel();

  if (!carouselState) throw new Error("useCarousel must be used within a <Carousel />");

  return carouselState;
}

export { useCarousel, useProvideCarousel };
